import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { HouseholdDto } from './dto/household.dto';
import { v4 as uuidv4 } from 'uuid';
import { User } from '@prisma/client';
import { IdDto } from '../shared/dto/id.dto';

@Injectable()
export class HouseholdsService {
  constructor(private readonly prisma: PrismaService) {}

  async createHousehold(data: HouseholdDto, user: User) {
    const password = uuidv4().split('-').shift();
    const household = await this.prisma.household.create({
      data: {
        name: data.name,
        password,
      },
    });

    await this.prisma.householdHasUser.create({
      data: {
        householdId: household.id,
        userId: user.id,
      },
    });

    await this.createDefaultUnits(household.id);

    return household;
  }

  async createDefaultUnits(householdId: string) {
    const defaultUnits = [
      {
        type: 'float',
        abbreviation: 'g',
        name: 'gramm',
      },
      {
        type: 'integer',
        abbreviation: 'pc',
        name: 'piece',
      },
      {
        type: 'float',
        abbreviation: 'ml',
        name: 'milliliter',
      },
    ];

    return await Promise.all(
      defaultUnits.map(async (unit) => {
        if (
          !(await this.prisma.unit.findFirst({
            where: { householdId, name: unit.name },
          }))
        ) {
          await this.prisma.unit.create({
            data: {
              ...unit,
              householdId,
            },
          });
        }
      }),
    );
  }
}
