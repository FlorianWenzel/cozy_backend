import { Module } from '@nestjs/common';
import { HouseholdsGateway } from './households.gateway';
import { HouseholdsService } from './households.service';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [HouseholdsGateway, HouseholdsService, PrismaService],
})
export class HouseholdsModule {}
