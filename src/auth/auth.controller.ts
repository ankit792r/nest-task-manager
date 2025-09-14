import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) { }

  @Post('login')
  @ApiResponse({ status: 200, description: 'user logged in successfully' })
  @ApiResponse({ status: 400, description: 'Dto validation failed'})
  login(@Body(ValidationPipe) data: LoginDto) {
    return this.authService.loginUser(data);
  }

  @Post('register')
  register(@Body(ValidationPipe) data: CreateUserDto) {
    return this.userService.createUser(data);
  }
}
