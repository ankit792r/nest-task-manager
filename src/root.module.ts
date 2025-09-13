import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UserModule,
    TaskModule,
    AuthModule,
    MongooseModule.forRoot('mongodb://localhost/task-manager'),
  ],
})
export class RootModule { }
