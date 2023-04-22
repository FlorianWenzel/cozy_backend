import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ItemsService {
  constructor(private readonly prisma: PrismaService) {}

  async createItem(createItemDto: CreateItemDto, householdId) {
    return this.prisma.item.create({ data: { ...createItemDto, householdId } });
  }

  async getItems(householdId: string) {
    return this.prisma.item.findMany({ where: { householdId } });
  }
}
