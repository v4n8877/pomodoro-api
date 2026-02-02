import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from 'src/auth/dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  // eslint-disable-next-line prettier/prettier
  constructor(private authService: AuthService, private usersService: UsersService) { }

  @Post('register')
  async register(
    @Body() createAuthDto: CreateAuthDto,
  ): Promise<{ token: string }> {
    return await this.authService.register(createAuthDto);
  }

  @Post('login')
  async login(@Body() LoginAuthDto: LoginAuthDto): Promise<{ token: string }> {
    return await this.authService.login(LoginAuthDto);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async profile(@Req() req: any): Promise<{
    email: string;
  }> {
    const user = await this.usersService.findUserByEmail(req.user.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return {
      email: user.email,
    };
  }
}
