import { Request } from 'express';
import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

const RequestUser = createParamDecorator((_, ctx: ExecutionContext) => {
  const user = ctx.switchToHttp().getRequest<Request>().user ?? null;

  if (user === null) {
    throw new UnauthorizedException();
  }

  return user;
});

export { RequestUser };
