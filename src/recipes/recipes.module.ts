import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesGateway } from './recipes.gateway';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth/auth.module';
import { RecipesController } from './recipes.controller';

@Module({
  imports: [AuthModule],
  providers: [RecipesService, RecipesGateway, PrismaService],
  controllers: [RecipesController],
})
export class RecipesModule {}
