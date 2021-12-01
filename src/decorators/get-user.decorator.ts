import {
  createParamDecorator,
  ExecutionContext,
  Request,
} from '@nestjs/common';
import { User } from '../models/user';
import { UserNotFoundException } from '../exceptions/user-not-found.exception';

interface RequestWithUser extends Request {
  user: User;
}

export const GetUser = createParamDecorator((ctx: ExecutionContext): User => {
  const request = <RequestWithUser>ctx.switchToHttp().getRequest();
  const { user } = request;
  if (!user) {
    throw new UserNotFoundException();
  }
  return user;
});
