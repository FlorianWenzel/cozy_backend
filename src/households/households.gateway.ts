import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { HouseholdDto } from './dto/household.dto';
import { HouseholdsService } from './households.service';
import { Req } from '@nestjs/common';

@WebSocketGateway()
export class HouseholdsGateway {
  constructor(private readonly householdsService: HouseholdsService) {}
  @SubscribeMessage('households/create')
  async handleMessage(@MessageBody() householdDto: HouseholdDto, @Req() req) {
    return this.householdsService.createHousehold(householdDto, req.user);
    return 'household_created';
  }
}
