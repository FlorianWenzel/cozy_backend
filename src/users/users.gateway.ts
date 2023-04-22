import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { SignupDto } from './dto/signup.dto';
import { Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { WsLocalGuard } from '../auth/guards/ws-local.guard';
import { AuthService } from '../auth/auth.service';
import { WsJwtGuard } from '../auth/guards/ws-jwt.guard';
import { SetUsernameDto } from './dto/set-username.dto';
import { TokensDto } from './dto/tokens.dto';
import { Socket } from 'socket.io';
@WebSocketGateway({ cors: true })
export class UsersGateway {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @SubscribeMessage('users/signup')
  @UsePipes(new ValidationPipe())
  async handleSignup(
    @MessageBody() signupDto: SignupDto,
  ): Promise<TokensDto | string> {
    const user = await this.userService.signUp(signupDto);
    if (!user) {
      return 'email_taken';
    }
    const tokens = await this.authService.getTokens(user);

    return { ...tokens };
  }

  @SubscribeMessage('users/login')
  @UsePipes(new ValidationPipe())
  @UseGuards(WsLocalGuard)
  async handleLogin(
    @Req() req,
    @ConnectedSocket() client: Socket,
  ): Promise<string | TokensDto> {
    const tokens = await this.authService.getTokens(req.user);
    if (!tokens) {
      return 'invalid_credentials';
    }
    const householdId = req.user.households?.[0]?.householdId;
    if (householdId) client.join(householdId);

    return tokens;
  }

  @SubscribeMessage('users/refresh')
  @UsePipes(new ValidationPipe())
  async handleRefresh(
    @MessageBody() refreshToken: string,
    @ConnectedSocket() client: Socket,
  ): Promise<string | TokensDto> {
    const user = await this.authService.verifyUser(refreshToken);
    if (!user) {
      return 'invalid_token';
    }
    const householdId = user.households?.[0]?.householdId;
    if (householdId) client.join(householdId);
    return await this.authService.getTokens(user);
  }

  @SubscribeMessage('users/get')
  @UsePipes(new ValidationPipe())
  @UseGuards(WsJwtGuard)
  async handleGetUser(@Req() req): Promise<User> {
    return await this.userService.findOne(req.user.email, {
      include: { households: { include: { household: true } } },
    });
  }
  @SubscribeMessage('users/set-username')
  @UsePipes(new ValidationPipe())
  @UseGuards(WsJwtGuard)
  async handleUpdateUser(
    @Req() req,
    @MessageBody() setUsernameDto: SetUsernameDto,
  ) {
    const user = await this.userService.findOne(req.user.email);
    user.name = setUsernameDto.username;
    await this.userService.save(user);
    return 'success';
  }
}
