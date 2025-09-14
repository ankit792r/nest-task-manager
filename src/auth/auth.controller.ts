import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  ParseBoolPipe,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) { }

  @ApiResponse({ status: 200, description: 'user logged in successfully' })
  @ApiResponse({ status: 400, description: 'Dto validation failed' })
  @ApiBody({
    type: LoginDto,
    description: 'Login user',
    examples: {
      a: {
        summary: 'User credentials',
        value: {
          email: 'test@email.com',
          password: 'testpass',
        } as LoginDto,
      },
      b: {
        summary: 'Admin credentials',
        value: {
          email: 'admin@email.com',
          password: 'testpass',
        } as LoginDto,
      },
    },
  })
  @Post('login')
  login(@Body(ValidationPipe) data: LoginDto) {
    return this.authService.loginUser(data);
  }

  @ApiQuery({
    name: 'admin',
    required: false,
    type: Boolean,
  })
  @ApiBody({
    type: LoginDto,
    description: 'Register user',
    examples: {
      a: {
        summary: 'User registration',
        value: {
          email: 'test@email.com',
          password: 'testpass',
          name: 'Test user',
        } as CreateUserDto,
      },
      b: {
        summary: 'Admin registration',
        value: {
          email: 'admin@email.com',
          password: 'testpass',
          name: 'Admin User',
        } as CreateUserDto,
      },
    },
  })
  @Post('register')
  register(
    @Body(ValidationPipe) data: CreateUserDto,
    @Query('admin', new ParseBoolPipe({ optional: true }))
    admin: boolean = false,
  ) {
    return this.userService.createUser(data, admin);
  }
}
