import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Req, UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../auth/guards/ws-jwt.guard';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { Server } from 'socket.io';

@WebSocketGateway()
export class ItemsGateway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly itemsService: ItemsService) {}

  @SubscribeMessage('items/create')
  @UseGuards(WsJwtGuard)
  async createItem(@Req() req, @MessageBody() createItemDto: CreateItemDto) {
    const newItem = await this.itemsService.createItem(
      createItemDto,
      req.user.households[0].householdId,
    );

    this.server
      .to(req.user.households[0].householdId)
      .emit('items/create', newItem);
    return newItem;
  }

  @SubscribeMessage('items/get')
  @UseGuards(WsJwtGuard)
  async getItems(@Req() req, @MessageBody() createItemDto: CreateItemDto) {
    return await this.itemsService.getItems(req.user.households[0].householdId);
  }
}
