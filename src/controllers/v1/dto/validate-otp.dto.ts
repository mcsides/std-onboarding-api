import { IsEmail, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidateOtpDto {
  @ApiProperty({
    example: 'mcwiise@mailinator.com',
    description: 'The email to validate',
  })
  @IsEmail()
  email: string;

  @IsNumberString()
  @ApiProperty({
    example: '123456',
    description: 'The OTP code to validate',
  })
  otp: string;
}
