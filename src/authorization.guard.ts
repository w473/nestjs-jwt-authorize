import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { KeycloakJwtToken } from './models/keycloak.jwt.token';
import { getUserFromKeycloakJwtToken } from 'src/models/user';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly authorizationHeader: string,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    if (this.reflector.get<boolean>('public', context.getHandler())) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    try {
      const token = request.header(this.authorizationHeader);
      if (token) {
        const jwt = <KeycloakJwtToken>(
          JSON.parse(Buffer.from(token, 'base64').toString())
        );
        request.user = getUserFromKeycloakJwtToken(jwt);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
}
