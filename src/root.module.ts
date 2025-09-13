import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    UserModule,
    TaskModule,
    MongooseModule.forRoot('mongodb://localhost/task-manager'),
  ],
})
export class RootModule { }
