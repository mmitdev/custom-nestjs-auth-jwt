import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { email, name, password } = createUserDto;

    const alreadyRegistered = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (alreadyRegistered) {
      throw new BadRequestException('User already registered!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    const accessToken = this.jwtService.sign(
      {
        sub: user.id,
        email : user.email,
        name : user.name
      },
      {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn : process.env.ACCESS_TOKEN_EXPIRE_IN
      },
    );

    const refreshToken = this.jwtService.sign(
      {
        sub: user.id,
      },
      {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn : process.env.REFRESH_TOKEN_EXPIRE_IN
      },
    );

    return {
        accessToken,
        refreshToken
    }
  }
}
