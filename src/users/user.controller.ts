import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiResponse({ status: 409, description: 'User already exists.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findOne(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  // --- Advanced Features ---

  @Patch(':id/profile')
  @ApiOperation({ summary: 'Update user profile (bio, location, avatar)' })
  updateProfile(@Param('id') id: string, @Body() profile: { bio?: string; location?: string; avatarUrl?: string }) {
    return this.userService.updateProfile(id, profile);
  }

  @Patch(':id/preferences')
  @ApiOperation({ summary: 'Update user preferences' })
  updatePreferences(@Param('id') id: string, @Body() preferences: any) {
    return this.userService.updatePreferences(id, preferences);
  }

  @Post(':id/activity')
  @ApiOperation({ summary: 'Log user activity' })
  logActivity(@Param('id') id: string, @Body() body: { action: string; metadata?: any }) {
    return this.userService.logActivity(id, body.action, body.metadata);
  }

  @Get(':id/activity')
  @ApiOperation({ summary: 'Get user activity history' })
  getActivityHistory(@Param('id') id: string) {
    return this.userService.getActivityHistory(id);
  }

  @Patch(':id/avatar')
  @ApiOperation({ summary: 'Update user avatar' })
  updateAvatar(@Param('id') id: string, @Body() body: { avatarUrl: string }) {
    return this.userService.updateAvatar(id, body.avatarUrl);
  }

  @Get('search/:query')
  @ApiOperation({ summary: 'Search users by name, email, or location' })
  searchUsers(@Param('query') query: string) {
    return this.userService.searchUsers(query);
  }

  @Post(':id/follow/:targetId')
  @ApiOperation({ summary: 'Follow another user' })
  followUser(@Param('id') id: string, @Param('targetId') targetId: string) {
    return this.userService.followUser(id, targetId);
  }

  @Delete(':id/follow/:targetId')
  @ApiOperation({ summary: 'Unfollow a user' })
  unfollowUser(@Param('id') id: string, @Param('targetId') targetId: string) {
    return this.userService.unfollowUser(id, targetId);
  }

  @Get(':id/followers')
  @ApiOperation({ summary: 'List followers of a user' })
  getFollowers(@Param('id') id: string) {
    return this.userService.getFollowers(id);
  }

  @Get(':id/following')
  @ApiOperation({ summary: 'List users a user is following' })
  getFollowing(@Param('id') id: string) {
    return this.userService.getFollowing(id);
  }

  @Get(':id/analytics')
  @ApiOperation({ summary: 'Get user analytics and engagement metrics' })
  getUserAnalytics(@Param('id') id: string) {
    return this.userService.getUserAnalytics(id);
  }

  @Patch(':id/privacy')
  @ApiOperation({ summary: 'Update user privacy settings' })
  updatePrivacySettings(@Param('id') id: string, @Body() privacySettings: any) {
    return this.userService.updatePrivacySettings(id, privacySettings);
  }

  @Post(':id/export')
  @ApiOperation({ summary: 'Request user data export' })
  requestDataExport(@Param('id') id: string) {
    return this.userService.requestDataExport(id);
  }
}
