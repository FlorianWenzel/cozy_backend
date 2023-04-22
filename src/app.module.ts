import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { HouseholdsModule } from './households/households.module';
import { RecipesModule } from './recipes/recipes.module';
import { UnitsModule } from './units/units.module';
import { ItemsModule } from './items/items.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    HouseholdsModule,
    RecipesModule,
    UnitsModule,
    ItemsModule,
  ],
  providers: [AppService, PrismaService],
})
export class AppModule {}
