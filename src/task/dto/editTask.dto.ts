import { IsNotEmpty, IsString } from 'class-validator';
import { ITask } from '../interfaces/task';
import { ApiProperty, ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';

@ApiSchema({
  name: 'Edit taks Dto',
  description: 'Create/Edit tasks Dto',
})
export class EditTaskDto implements ITask {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional()
  status: string;
}
