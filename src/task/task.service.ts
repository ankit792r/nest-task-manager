import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { Model } from 'mongoose';
import { EditTaskDto } from './dto/editTask.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserPayload } from 'src/auth/auth.guard';
import { Role } from 'src/lib/role.enum';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) { }

  async createTask(userId: string, data: EditTaskDto): Promise<TaskDocument> {
    return await this.taskModel.create({ ...data, user: userId });
  }

  async updateTask(taskId: string, data: EditTaskDto): Promise<Task> {
    let completedAt: Date | null = null;
    if (data.status.trim().toLowerCase() == 'done') completedAt = new Date();

    const updatedtask = await this.taskModel
      .findByIdAndUpdate(
        taskId,
        {
          $set: { ...data, completedAt },
        },
        { new: true },
      )
      .lean()
      .exec();

    if (!updatedtask)
      throw new HttpException('Failed to update task', HttpStatus.BAD_REQUEST);
    return updatedtask;
  }

  async deleteTask(taskId: string): Promise<string> {
    await this.taskModel.findByIdAndDelete(taskId);
    return taskId;
  }

  async listTasks(
    userPayload: UserPayload,
    page: number = 1,
    limit: number = 10,
    status?: string,
  ) {
    const filter: Record<string, unknown> = {};
    if (status) filter['status'] = status;

    if (userPayload.role == Role.User.toString())
      filter['user'] = userPayload._id;

    const countPromise = this.taskModel.countDocuments(filter);
    const tasksPromise = this.taskModel
      .find(filter)
      .limit(limit)
      .skip((page - 1) * limit)
      .lean()
      .exec();

    const [count, tasks] = await Promise.all([countPromise, tasksPromise]);
    const totalPages = Math.ceil(count / limit);

    return {
      tasks,
      pagination: {
        page,
        limit,
        totalPages,
        count,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async getTaskAnalytics() {

  }
}
