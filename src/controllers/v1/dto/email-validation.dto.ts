export class EmailValidationDto {
  onboardingId: string;
  email: string;

  constructor(onboardingId: string, email: string) {
    this.onboardingId = onboardingId;
    this.email = email;
  }
}
