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
import { type Request as ExRequest } from 'express';
import { Roles } from 'src/lib/roles.decorator';
import { Role } from 'src/lib/role.enum';
import { AuthGuard, UserPayload } from 'src/lib/guards/auth.guard';
import { RoleGuard } from 'src/lib/guards/role.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, RoleGuard)
@Controller('tasks')
export class TaskController {
  constructor(@Inject() private taskService: TaskService) { }

  @ApiResponse({
    status: 200,
    description: 'list of tasks',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'status',
    type: String,
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

  @ApiOperation({
    summary: 'User-Only endpoint',
    description: 'Accessible only by users with the `user` role.',
  })
  @ApiBody({
    type: EditTaskDto,
    description: 'Task Creation body',
    examples: {
      a: {
        summary: 'Example value 1',
        value: {
          name: 'Test task',
          description: 'test task description',
        } as EditTaskDto,
      },
      b: {
        summary: 'Example value 2',
        value: {
          name: 'Test task 1',
          description: 'Test task description 1',
        } as EditTaskDto,
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Task created successfully',
  })
  @Post()
  @Roles(Role.User)
  createTask(
    @Request() req: ExRequest,
    @Body(ValidationPipe) data: EditTaskDto,
  ) {
    const userPayload = req.user as UserPayload;
    return this.taskService.createTask(userPayload._id, data);
  }

  @ApiBody({
    type: EditTaskDto,
    description: 'Task Update body',
    examples: {
      a: {
        summary: 'Example value 1',
        value: {
          name: 'Test task update',
          description: 'test task update description',
        } as EditTaskDto,
      },
      b: {
        summary: 'Example value 2',
        value: {
          name: 'Test task update 1',
          description: 'Test task update description 1',
        } as EditTaskDto,
      },
    },
  })
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
