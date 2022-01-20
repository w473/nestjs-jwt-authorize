import {
  Inject,
  Injectable,
  Logger,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TokenParserInterface } from 'src/logic/token.parser.interface';
export const AUTHORIZATION_HEADER_NAME = 'AUTHORIZATION_HEADER_NAME';
export const TOKEN_PARSER_INTERFACE = 'TokenParserInterface';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthenticationMiddleware.name);

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
        this.logger.verbose('Received JWT', jwt);
        req.user = this.tokenParser.getUserFromTokenObject(jwt);
        this.logger.verbose('User parsed from JWT', req.user);
        return next();
      }
    } catch (error) {
      this.logger.verbose('Fault parsing JWT', error);
    }
    this.logger.verbose('Token does not exists');
    throw new UnauthorizedException();
  }
}
