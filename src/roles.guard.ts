import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from './models/user';
import { KeycloakJwtToken } from './models/keycloak.jwt.token';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    if (this.reflector.get<boolean>('public', context.getHandler())) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    if (!request.user || !(request.user instanceof User)) {
      return false;
    }
    const user = <User<KeycloakJwtToken>>request.user;

    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles || roles.length === 0) {
      return true;
    }

    for (let i = 0; i < roles.length; i++) {
      if (user.roles.find((role) => role === roles[i])) {
        return true;
      }
    }
    return false;
  }
}
