import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export interface RequiredRoles {
  resource: string;
  action: string;
}

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RequiredRoles>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    // Check if user has required permissions based on their roles
    if (user.roles && user.roles.length > 0) {
      // In a real implementation, you would check the user's permissions against the required roles
      // For now, we'll implement a basic check

      // Example: check if user has admin role or appropriate permissions
      const hasPermission = user.roles.some((role: any) => {
        // This is a simplified check - in a real implementation you'd check against actual permissions
        return role.name === 'ADMIN' || this.checkUserPermissions(user, requiredRoles);
      });

      return hasPermission;
    }

    return false;
  }

  private checkUserPermissions(user: any, requiredRoles: RequiredRoles): boolean {
    // This would check the user's actual permissions against the required roles
    // Implementation would depend on your specific RBAC model
    return true; // Simplified for now
  }
}
