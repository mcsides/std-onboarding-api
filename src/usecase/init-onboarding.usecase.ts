import { Injectable } from '@nestjs/common';
import { Onboarding } from 'src/domain/entity/onboarding';
import { OnboardingState } from 'src/domain/entity/onboarding-state.enum';
import { OnboardingRepository } from 'src/domain/repository/onboarding.repository';

@Injectable()
export class InitOnboardingUsecase {
  constructor(private readonly onbardingRepository: OnboardingRepository) {}

  async exe(onboardingId: string): Promise<Onboarding> {
    const obToCreate = Onboarding.builder()
      .setOnboardingId(onboardingId)
      .setState(OnboardingState.INITIATED)
      .build();

    return this.onbardingRepository
      .createOnboarding(obToCreate)
      .then((onboardingCreated) => {
        return onboardingCreated;
      });
  }
}
