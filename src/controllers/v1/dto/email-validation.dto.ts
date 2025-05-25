import { ApiProperty } from '@nestjs/swagger';

export class EmailValidationDto {
    @ApiProperty()
  onboardingId: string;
    @ApiProperty()
  email: string;

  constructor(onboardingId: string, email: string) {
    this.onboardingId = onboardingId;
    this.email = email;
  }
}
