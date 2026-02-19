import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { RedisService } from '../common/services/redis.service';
import { v4 as uuidv4 } from 'uuid';
import { StructuredLoggerService } from '../common/logging/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly logger: StructuredLoggerService,
  ) {
    this.logger.setContext('AuthService');
  }

  async register(createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDto);
      await this.sendVerificationEmail(user.id, user.email);
      this.logger.logAuth('User registration successful', { userId: user.id });
      return {
        message: 'User registered successfully. Please check your email for verification.',
      };
    } catch (error) {
      this.logger.error('User registration failed', error.stack, {
        email: createUserDto.email,
      });
      throw error;
    }
  }

  async login(credentials: { email?: string; password?: string; walletAddress?: string; signature?: string }) {
    let user: any;

    try {
      if (credentials.email && credentials.password) {
        user = await this.validateUserByEmail(credentials.email, credentials.password);
      } else if (credentials.walletAddress) {
        user = await this.validateUserByWallet(credentials.walletAddress, credentials.signature);
      } else {
        throw new BadRequestException('Email/password or wallet address/signature required');
      }

      if (!user) {
        this.logger.warn('Invalid login attempt', { email: credentials.email });
        throw new UnauthorizedException('Invalid credentials');
      }

      this.logger.logAuth('User login successful', { userId: user.id });
      return this.generateTokens(user);
    } catch (error) {
      this.logger.error('User login failed', error.stack, {
        email: credentials.email,
      });
      throw error;
    }
  }

  async validateUserByEmail(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (!user || !user.password) {
      this.logger.warn('Email validation failed: User not found', { email });
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      this.logger.warn('Email validation failed: Invalid password', { email });
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...result } = user as any;
    return result;
  }

  async validateUserByWallet(walletAddress: string, signature?: string): Promise<any> {
    let user = await this.userService.findByWalletAddress(walletAddress);

    if (!user) {
      user = await this.userService.create({
        email: `${walletAddress}@wallet.auth`,
        password: Math.random().toString(36).slice(-10),
        walletAddress,
        firstName: 'Web3',
        lastName: 'User',
      });
      this.logger.logAuth('New Web3 user created', { walletAddress });
    }

    const { password: _, ...result } = user as any;
    return result;
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.userService.findById(payload.sub);
      if (!user) {
        this.logger.warn('Refresh token validation failed: User not found', {
          userId: payload.sub,
        });
        throw new UnauthorizedException('User not found');
      }

      const storedToken = await this.redisService.get(`refresh_token:${payload.sub}`);
      if (storedToken !== refreshToken) {
        this.logger.warn('Refresh token validation failed: Invalid token', {
          userId: payload.sub,
        });
        throw new UnauthorizedException('Invalid refresh token');
      }

      this.logger.logAuth('Token refreshed successfully', { userId: user.id });
      return this.generateTokens(user);
    } catch (error) {
      this.logger.error('Token refresh failed', error.stack);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    await this.redisService.del(`refresh_token:${userId}`);
    this.logger.logAuth('User logged out successfully', { userId });
    return { message: 'Logged out successfully' };
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      this.logger.log('Forgot password request for non-existent user', { email });
      return { message: 'If email exists, a reset link has been sent' };
    }

    const resetToken = uuidv4();
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    // Save reset token and expiry in Redis
    await this.redisService.set(
      `password_reset:${resetToken}`,
      JSON.stringify({ userId: user.id, expiry: resetTokenExpiry }),
    );

    await this.sendPasswordResetEmail(user.email, resetToken);
    this.logger.log('Password reset email sent', { email });
    return { message: 'If email exists, a reset link has been sent' };
  }

  async resetPassword(resetToken: string, newPassword: string) {
    const resetData = await this.redisService.get(`password_reset:${resetToken}`);

    if (!resetData) {
      this.logger.warn('Invalid or expired password reset token received');
      throw new BadRequestException('Invalid or expired reset token');
    }

    const { userId, expiry } = JSON.parse(resetData);

    if (Date.now() > expiry) {
      await this.redisService.del(`password_reset:${resetToken}`);
      this.logger.warn('Expired password reset token used', { userId });
      throw new BadRequestException('Reset token has expired');
    }

    await this.userService.updatePassword(userId, newPassword);
    await this.redisService.del(`password_reset:${resetToken}`);

    this.logger.log('Password reset successfully', { userId });
    return { message: 'Password reset successfully' };
  }

  async verifyEmail(token: string) {
    const verificationData = await this.redisService.get(`email_verification:${token}`);

    if (!verificationData) {
      this.logger.warn('Invalid or expired email verification token');
      throw new BadRequestException('Invalid or expired verification token');
    }

    const { userId } = JSON.parse(verificationData);
    await this.userService.verifyUser(userId);
    await this.redisService.del(`email_verification:${token}`);

    this.logger.log('Email verified successfully', { userId });
    return { message: 'Email verified successfully' };
  }

  private generateTokens(user: any) {
    const payload = { sub: user.id, email: user.email };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '15m') as any,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d') as any,
    });

    this.redisService.set(`refresh_token:${user.id}`, refreshToken);

    this.logger.debug('Generated new tokens for user', { userId: user.id });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        walletAddress: user.walletAddress,
        isVerified: user.isVerified,
      },
    };
  }

  private async sendVerificationEmail(userId: string, email: string) {
    const verificationToken = uuidv4();

    // Save token in Redis
    const expiry = Date.now() + 3600000; // 1 hour
    await this.redisService.set(`email_verification:${verificationToken}`, JSON.stringify({ userId, expiry }));

    this.logger.log(`Verification email sent to ${email}`, { userId });
    console.log(`Verification email sent to ${email} with token: ${verificationToken}`);
  }

  private async sendPasswordResetEmail(email: string, resetToken: string) {
    this.logger.log(`Password reset email sent to ${email}`);
    console.log(`Password reset email sent to ${email} with token: ${resetToken}`);
  }
}
