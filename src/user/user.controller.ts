import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/userUpdate.dto';
import { IsObjectIdPipe } from '@nestjs/mongoose';
import { OptionalParseIntPipe } from 'src/lib/pipes/optionalParseInt.pipe';

@Controller('users')
export class UserController {
  constructor(@Inject() private userService: UserService) { }

  @Get('list')
  listUsers(
    @Query('limit', OptionalParseIntPipe) limit: number,
    @Query('page', OptionalParseIntPipe) page: number,
  ) {
    return this.userService.listUsers(page, limit);
  }

  @Get('byid/:userId')
  getUser(@Param('userId', IsObjectIdPipe) userId: string) {
    return this.userService.getUser(userId);
  }

  @Post('create')
  createUser(@Body(ValidationPipe) data: CreateUserDto) {
    return this.userService.createUser(data);
  }

  @Put('update/:userId')
  updateUser(
    @Param('userId', IsObjectIdPipe) userId: string,
    @Body(ValidationPipe) data: UpdateUserDto,
  ) {
    return this.userService.updateUser(userId, data);
  }

  @Delete('delete/:userId')
  deleteUser(@Param('userId', IsObjectIdPipe) userId: string) {
    return this.userService.deleteUser(userId);
  }
}
