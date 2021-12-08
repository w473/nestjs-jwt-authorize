import {
  createParamDecorator,
  ExecutionContext,
  Request,
} from '@nestjs/common';
import { User } from '../models/user';
import { UserNotFoundException } from '../exceptions/user-not-found.exception';

interface RequestWithUser<Token> extends Request {
  user: User<Token>;
}

export const GetUser = createParamDecorator(
  <Token>(data: unknown, ctx: ExecutionContext): User<Token> => {
    const request = <RequestWithUser<Token>>ctx.switchToHttp().getRequest();
    const { user } = request;
    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  },
);
