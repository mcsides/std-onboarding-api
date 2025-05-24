export class Onboarding {
  constructor(
    private readonly onboardingId: string,
    private readonly status: string,
    private readonly email: string,
    private readonly mobile?: number,
  ) {}

  getOnboardingId(): string {
    return this.onboardingId;
  }

  getStatus(): string {
    return this.status;
  }

  getEmail(): string {
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
  private status: string;
  private email: string;
  private mobile?: number;

  setOnboardingId(onboardingId: string): this {
    this.onboardingId = onboardingId;
    return this;
  }

  setStatus(status: string): this {
    this.status = status;
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
    if (!this.onboardingId) {
      throw new Error('onboardingId is required to build an Onboarding object');
    }
    if (!this.status) {
      throw new Error('status is required to build an Onboarding object');
    }
    if (!this.email) {
      throw new Error('email is required to build an Onboarding object');
    }
    return new Onboarding(
      this.onboardingId,
      this.status,
      this.email,
      this.mobile,
    );
  }
}
