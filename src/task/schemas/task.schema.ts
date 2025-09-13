import { HydratedDocument } from 'mongoose';
import { ITask } from '../interfaces/task';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TaskDocument = HydratedDocument<ITask>;

@Schema({ timestamps: true, versionKey: false })
export class Task implements ITask {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ default: 'TODO' })
  status: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
