import { Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async signUp(signupDto: SignupDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: { email: signupDto.email },
    });
    if (existingUser) {
      return null;
    }

    const hashedPassword: string = await new Promise((resolve) =>
      bcrypt.hash(signupDto.password, 10, (err, hash) => resolve(hash)),
    );

    await this.prisma.user.create({
      data: {
        email: signupDto.email,
        password: hashedPassword,
      },
    });

    return this.findOne(signupDto.email);
  }

  async findOne(email: string, options?: any): Promise<User> {
    const user = await this.prisma.user.findFirst({
      ...options,
      where: { email },
    });
    delete user.password;
    return user;
  }

  async save(user: User) {
    await this.prisma.user.update({
      where: { id: user.id },
      data: user,
    });
  }
}
