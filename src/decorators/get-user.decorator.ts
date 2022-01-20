import {
  createParamDecorator,
  ExecutionContext,
  Request,
} from '@nestjs/common';
import { UserNotFoundException } from '../exceptions/user-not-found.exception';
import { UserInterface } from 'src/models/user.interface';

interface RequestWithUser extends Request {
  user: UserInterface;
}

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserInterface => {
    const request = <RequestWithUser>ctx.switchToHttp().getRequest();
    const { user } = request;
    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  },
);
