import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@ApiSchema({
  name: 'Login Dto',
  description: 'Login body type',
})
export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ type: 'string' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'string' })
  password: string;
}
