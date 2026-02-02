import { LoginAuthDto } from './dto/login.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async register(createUserDto: CreateAuthDto): Promise<{ token: string }> {
    // bcrypt the password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.password = hashedPassword;

    // create user
    const user = await this.usersService.createUser(createUserDto);

    // generate jwt token
    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
    });
    return { token };
  }

  async login(LoginDto: LoginAuthDto) {
    const user = await this.usersService.findUserByEmail(LoginDto.email);
    if (!user || !(await bcrypt.compare(LoginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // generate jwt token
    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
    });
    return { token };
  }
}
