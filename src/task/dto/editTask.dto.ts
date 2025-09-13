import { IsNotEmpty, IsString } from 'class-validator';
import { ITask } from '../interfaces/task';

export class EditTaskDto implements ITask {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  status: string;
}
