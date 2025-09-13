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
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { EditTaskDto } from './dto/editTask.dto';
import { IsObjectIdPipe } from '@nestjs/mongoose';
import { OptionalParseIntPipe } from 'src/lib/pipes/optionalParseInt.pipe';
import { AuthGuard, UserPayload } from 'src/auth/auth.guard';
import { type Request as ExRequest } from 'express';
import { RoleGuard } from 'src/auth/role.guard';
import { Roles } from 'src/lib/roles.decorator';
import { Role } from 'src/lib/role.enum';

@UseGuards(AuthGuard, RoleGuard)
@Controller('tasks')
export class TaskController {
  constructor(@Inject() private taskService: TaskService) { }

  @Get()
  @Roles(Role.Admin, Role.User)
  listTasks(
    @Request() req: ExRequest,
    @Query('page', OptionalParseIntPipe) page: number,
    @Query('limit', OptionalParseIntPipe) limit: number,
    @Query('status') status: string,
  ) {
    const userPayload = req.user as UserPayload;
    return this.taskService.listTasks(userPayload, page, limit, status);
  }

  @Post()
  @Roles(Role.User)
  createTask(
    @Request() req: ExRequest,
    @Body(ValidationPipe) data: EditTaskDto,
  ) {
    const userPayload = req.user as UserPayload;
    return this.taskService.createTask(userPayload._id, data);
  }

  @Put(':taskId')
  @Roles(Role.Admin, Role.User)
  updateTask(
    @Param('taskId', IsObjectIdPipe) taskId: string,
    @Body(ValidationPipe) data: EditTaskDto,
  ) {
    return this.taskService.updateTask(taskId, data);
  }

  @Roles(Role.User, Role.Admin)
  @Delete(':taskId')
  deleteTask(@Param('taskId', IsObjectIdPipe) taskId: string) {
    return this.taskService.deleteTask(taskId);
  }
}
