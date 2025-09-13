import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { Model } from 'mongoose';
import { EditTaskDto } from './dto/editTask.dto';
import { ITask } from './interfaces/task';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) { }

  async createTask(data: EditTaskDto): Promise<TaskDocument> {
    return await this.taskModel.create(data);
  }

  async updateTask(taskId: string, data: EditTaskDto): Promise<ITask> {
    const updatedtask = await this.taskModel
      .findByIdAndUpdate(
        taskId,
        {
          $set: data,
        },
        { new: true },
      )
      .lean()
      .exec();

    if (!updatedtask) throw new Error('Failed to update task');
    return updatedtask;
  }

  async deleteTask(taskId: string): Promise<string> {
    await this.taskModel.findByIdAndDelete(taskId);
    return taskId;
  }

  async listTasks(page: number = 1, limit: number = 10, status?: string) {
    const filter: Record<string, unknown> = {};
    if (status) filter['status'] = status;

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
}
