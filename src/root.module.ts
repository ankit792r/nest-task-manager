import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { AuthModule } from './auth/auth.module';
import { AnalyticsModule } from './analytics/analyrics.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    TaskModule,
    AuthModule,
    AnalyticsModule,
    MongooseModule.forRoot(
      (process.env.MONGO_URL as string) || 'mongodb://localhost/task-manager',
    ),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60 * 1000,
          limit: 100,
        },
      ],
    }),
  ],
})
export class RootModule {}
