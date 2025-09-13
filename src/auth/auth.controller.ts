import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/user/dto/createUser.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('login')
  login(@Body(ValidationPipe) data: LoginDto) {
    return this.authService.loginUser(data);
  }

  @Post('register')
  register(@Body(ValidationPipe) data: CreateUserDto) {
    return this.userService.createUser(data);
  }
}
