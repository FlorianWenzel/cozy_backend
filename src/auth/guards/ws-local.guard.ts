import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from '@prisma/client';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsLocalGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const [socket, data] = context.getArgs();
    const user: User = await this.authService.validateUser(
      data.email,
      data.password,
    );
    if (!user) {
      socket.emit('users/signup', 'invalid_credentials');
      throw new WsException('Invalid Credentials');
    }
    context.switchToHttp().getRequest().user = user;

    return Boolean(user);
  }
}
