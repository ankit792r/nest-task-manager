import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/user/schemas/user.schema';
import { ApiProperty } from '@nestjs/swagger';

export type TaskDocument = HydratedDocument<Task>;

@Schema({ timestamps: true, versionKey: false })
export class Task {
  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @Prop()
  description: string;

  @ApiProperty()
  @Prop({ default: 'TODO' })
  status: string;

  @ApiProperty()
  @Prop({ type: Date })
  completedAt: Date;

  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: User;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
