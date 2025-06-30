import { IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidateMobileDto {
  @ApiProperty({
    example: '3186666666',
    description: 'The mobile number to validate',
  })
  @IsNumberString()
  mobile: string;
}
