import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma.service';
import { WsLocalGuard } from './guards/ws-local.guard';
import { WsJwtGuard } from './guards/ws-jwt.guard';

@Module({
  providers: [AuthService, PrismaService, WsLocalGuard, WsJwtGuard],
  exports: [AuthService],
})
export class AuthModule {}
