import { CanActivate, ExecutionContext } from '@nestjs/common';

export class UsersGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    console.log('Inside Guard', request.session.userId);
    return request.session.userId;
  }
}
