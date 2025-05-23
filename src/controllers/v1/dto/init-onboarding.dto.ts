export class InitOnboardingDto {
  constructor(
    private readonly onboardingId: string,
    private readonly obState: string,
  ) {}

  getOnboardingId(): string {
    return this.onboardingId;
  }

  getObState(): string {
    return this.obState;
  }
}
