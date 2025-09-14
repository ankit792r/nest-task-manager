import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/userUpdate.dto';
import { IsObjectIdPipe } from '@nestjs/mongoose';
import { OptionalParseIntPipe } from 'src/lib/pipes/optionalParseInt.pipe';
import { ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/lib/guards/auth.guard';
import { RoleGuard } from 'src/lib/guards/role.guard';

@Controller('users')
export class UserController {
  constructor(@Inject() private userService: UserService) { }

  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'list all users',
  })
  @Get('list')
  listUsers(
    @Query('limit', OptionalParseIntPipe) limit: number,
    @Query('page', OptionalParseIntPipe) page: number,
  ) {
    return this.userService.listUsers(page, limit);
  }

  @ApiResponse({
    status: 200,
    description: 'get user full details',
  })
  @Get('byid/:userId')
  getUser(@Param('userId', IsObjectIdPipe) userId: string) {
    return this.userService.getUser(userId);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RoleGuard)
  @Put('update/:userId')
  updateUser(
    @Param('userId', IsObjectIdPipe) userId: string,
    @Body(ValidationPipe) data: UpdateUserDto,
  ) {
    return this.userService.updateUser(userId, data);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RoleGuard)
  @Delete('delete/:userId')
  deleteUser(@Param('userId', IsObjectIdPipe) userId: string) {
    return this.userService.deleteUser(userId);
  }
}
