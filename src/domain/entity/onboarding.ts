export class Onboarding {
  constructor(
    private readonly onboardingId: string,
    private readonly state: string,
    private readonly email?: string,
    private readonly mobile?: number,
  ) {}

  getOnboardingId(): string {
    return this.onboardingId;
  }

  getState(): string {
    return this.state;
  }

  getEmail(): string | undefined {
    return this.email;
  }

  getMobile(): number | undefined {
    return this.mobile;
  }

  static builder() {
    return new OnboardingBuilder();
  }
}

class OnboardingBuilder {
  private onboardingId!: string;
  private state!: string;
  private email?: string;
  private mobile?: number;

  setOnboardingId(onboardingId: string): this {
    this.onboardingId = onboardingId;
    return this;
  }

  setState(state: string): this {
    this.state = state;
    return this;
  }

  setEmail(email: string): this {
    this.email = email;
    return this;
  }

  setMobile(mobile: number): this {
    this.mobile = mobile;
    return this;
  }

  build(): Onboarding {
    if (!this.onboardingId || !this.state) {
      throw new Error(
        'onboardingId and state are required to build an Onboarding object',
      );
    }
    return new Onboarding(
      this.onboardingId,
      this.state,
      this.email,
      this.mobile,
    );
  }
}
