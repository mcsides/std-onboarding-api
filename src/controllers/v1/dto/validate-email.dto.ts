import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidateEmailDto {
  @ApiProperty({
    example: 'mcwiise@mailinator.com',
    description: 'The email to validate',
  })
  @IsEmail()
  email: string;
}
