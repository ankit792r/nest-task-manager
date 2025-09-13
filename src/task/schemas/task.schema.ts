import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/user/schemas/user.schema';

export type TaskDocument = HydratedDocument<Task>;

@Schema({ timestamps: true, versionKey: false })
export class Task {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ default: 'TODO' })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: User;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
