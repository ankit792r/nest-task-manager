import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from 'src/lib/role.enum';
import { Task } from 'src/task/schemas/task.schema';
import { User } from 'src/user/schemas/user.schema';

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  return `${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s`;
}

export class AnalyticsService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async getTaskAnalytics() {
    const taskPerStatusCountPromise = this.taskModel.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { status: '$_id', count: 1, _id: 0 } },
    ]);

    const averageCompletionTimePromise = this.taskModel.aggregate([
      {
        $match: {
          completedAt: { $exists: true, $ne: null },
          createdAt: { $exists: true, $ne: null },
        },
      },
      {
        $project: {
          durationInMs: {
            $subtract: ['$completedAt', '$createdAt'],
          },
        },
      },
      {
        $group: {
          _id: null,
          averageDurationMs: { $avg: '$durationInMs' },
        },
      },
    ]);

    // fixme: this aggregate function is not working, dont know why
    const taskPerUserCountPromise = this.taskModel.aggregate([
      {
        $lookup: {
          from: 'tasks',
          localField: '_id',
          foreignField: 'user',
          as: 'tasks',
        },
      },
      {
        $project: {
          userId: '$_id',
          email: 1,
          taskCount: { $size: '$tasks' },
          _id: 0,
        },
      },
    ]);

    const [taskPerStatusCount, averageCompletionTime, taskPerUserCount] =
      await Promise.all([
        taskPerStatusCountPromise,
        averageCompletionTimePromise,
        taskPerUserCountPromise,
      ]);

    console.log(averageCompletionTime);

    let averageResult = {};
    if (!averageCompletionTime.length)
      averageResult = {
        averageCompletionTime: 'No completed tasks yet.',
        averageDurationMs: 0,
      };
    else {
      const ms: number = averageCompletionTime[0].averageDurationMs as number;
      const humanReadable = formatDuration(ms);
      averageResult = {
        averageDurationMs: ms,
        averageCompletionTime: humanReadable,
      };
    }

    return {
      taskPerStatusCount: taskPerStatusCount,
      taskPerUserCount,
      averageCompletionTime: averageResult,
    };
  }

  async getUserAnalytics() {
    const adminUserCountPromise = this.userModel.countDocuments({
      role: Role.Admin.toString(),
    });
    const allUserCountPromise = this.userModel.countDocuments();

    const [adminCount, allUserCount] = await Promise.all([
      adminUserCountPromise,
      allUserCountPromise,
    ]);

    return {
      adminCount,
      userCount: allUserCount - adminCount,
    };
  }
}
