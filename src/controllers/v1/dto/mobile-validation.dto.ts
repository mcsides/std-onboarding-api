import { ApiProperty } from '@nestjs/swagger';

export class MobileValidationDto {
  @ApiProperty()
  onboardingId: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  mobile: string;

  constructor(onboardingId: string, email: string, mobile: string) {
    this.onboardingId = onboardingId;
    this.email = email;
    this.mobile = mobile;
  }
}
