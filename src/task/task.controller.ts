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
import { TaskService } from './task.service';
import { EditTaskDto } from './dto/editTask.dto';
import { IsObjectIdPipe } from '@nestjs/mongoose';
import { OptionalParseIntPipe } from 'src/lib/pipes/optionalParseInt.pipe';

@Controller('tasks')
export class TaskController {
  constructor(@Inject() private taskService: TaskService) { }

  @Get('list')
  listTasks(
    @Query('page', OptionalParseIntPipe) page: number,
    @Query('limit', OptionalParseIntPipe) limit: number,
    @Query('status') status: string,
  ) {
    return this.taskService.listTasks(page, limit, status);
  }

  @Post('create')
  createTask(@Body(ValidationPipe) data: EditTaskDto) {
    return this.taskService.createTask(data);
  }

  @Put('update/:taskId')
  updateTask(
    @Param('taskId', IsObjectIdPipe) taskId: string,
    @Body(ValidationPipe) data: EditTaskDto,
  ) {
    return this.taskService.updateTask(taskId, data);
  }

  @Delete('delete/:taskId')
  deleteTask(@Param('taskId', IsObjectIdPipe) taskId: string) {
    return this.taskService.deleteTask(taskId);
  }
}
