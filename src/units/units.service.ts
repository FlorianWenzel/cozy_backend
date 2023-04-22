import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UnitsService {
  constructor(private readonly prisma: PrismaService) {}

  getUnits(householdId: string) {
    return this.prisma.unit.findMany({ where: { householdId } });
  }
}
