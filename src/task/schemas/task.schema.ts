import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema({ timestamps: true, versionKey: false })
export class Task {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ default: 'TODO' })
  status: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
