import {
  Inject,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { getUserFromKeycloakJwtToken } from '../models/user';
import { KeycloakJwtToken } from '../models/keycloak.jwt.token';

export const AUTHORIZATION_HEADER_NAME = 'AUTHORIZATION_HEADER_NAME';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(
    @Inject(AUTHORIZATION_HEADER_NAME) private authorizationHeader: string,
  ) {}

  use(
    req: Request & { user: any },
    res: Response,
    next: NextFunction,
  ): NextFunction | void {
    try {
      const token = req.header(this.authorizationHeader);
      if (token) {
        const jwt = <KeycloakJwtToken>(
          JSON.parse(Buffer.from(token, 'base64').toString())
        );
        req.user = getUserFromKeycloakJwtToken(jwt);
        return next();
      }
    } catch (error) {}
    throw new UnauthorizedException();
  }
}
