import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { WsJwtGuard } from '../auth/guards/ws-jwt.guard';
import { UnitsService } from './units.service';

@WebSocketGateway()
export class UnitsGateway {
  constructor(private readonly unitsService: UnitsService) {}

  @SubscribeMessage('units/get')
  @UseGuards(WsJwtGuard)
  @UsePipes(ValidationPipe)
  async getUnits(@Req() req) {
    return this.unitsService.getUnits(req.user.households[0].householdId);
  }
}
