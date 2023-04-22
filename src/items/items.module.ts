import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsGateway } from './items.gateway';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [ItemsService, ItemsGateway, PrismaService],
})
export class ItemsModule {}
