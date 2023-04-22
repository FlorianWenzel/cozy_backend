import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async validateUser(email: string, pass: string): Promise<User> {
    const user: User = await this.prisma.user.findFirst({
      where: { email },
      include: { households: true },
    });

    if (user && (await bcrypt.compare(pass, user.password))) {
      delete user.password;
      return user;
    }
    return null;
  }

  async verifyUser(token: string) {
    try {
      const decoded = jwt.verify(token, '1337') as Record<string, string>;

      const user = await this.prisma.user.findFirst({
        where: { email: decoded.email },
        include: { households: true },
      });

      if (user) {
        delete user.password;
        return user;
      }
    } catch (error) {
      return false;
    }
  }

  async getTokens(user) {
    try {
      const accessToken = jwt.sign({ email: user.email }, '1337', {
        expiresIn: '15m',
      });
      const refreshToken = jwt.sign({ email: user.email }, '1337', {
        expiresIn: '7d',
      });

      return { accessToken, refreshToken };
    } catch (error) {
      return null;
    }
  }
}
