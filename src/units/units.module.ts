import { Module } from '@nestjs/common';
import { UnitsService } from './units.service';
import { UnitsGateway } from './units.gateway';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [UnitsService, UnitsGateway, PrismaService],
})
export class UnitsModule {}
