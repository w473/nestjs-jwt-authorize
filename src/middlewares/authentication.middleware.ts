import {
  Inject,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TokenParserInterface } from 'src/logic/token.parser.interface';
export const AUTHORIZATION_HEADER_NAME = 'AUTHORIZATION_HEADER_NAME';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(
    @Inject(AUTHORIZATION_HEADER_NAME) private authorizationHeader: string,
    @Inject('TokenParserInterface')
    private tokenParser: TokenParserInterface,
  ) {}

  use(
    req: Request & { user: any },
    res: Response,
    next: NextFunction,
  ): NextFunction | void {
    try {
      const token = req.header(this.authorizationHeader);
      if (token) {
        const jwt = JSON.parse(Buffer.from(token, 'base64').toString());
        req.user = this.tokenParser.getUserFromTokenObject(jwt);
        return next();
      }
    } catch (error) {}
    throw new UnauthorizedException();
  }
}
