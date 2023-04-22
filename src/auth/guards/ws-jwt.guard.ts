import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: any): Promise<boolean | any> {
    const bearerToken =
      context.args[0].handshake.headers.authorization.split(' ')[1];

    const user = await this.authService.verifyUser(bearerToken);
    context.switchToHttp().getRequest().user = user;
    context.soc;

    if (user) return user;
    else return false;
  }
}
