import { Injectable } from '@nestjs/common';
import { Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OnboardingDocument } from './schema/onboarding-document.schema';
import { Model } from 'mongoose';
import { Onboarding } from '../entity/onboarding';

@Injectable()
export class OnboardingRepository {
  private readonly logger: Logger;
  constructor(
    @InjectModel(OnboardingDocument.name)
    private readonly onboardingModel: Model<OnboardingDocument>,
  ) {
    this.logger = new Logger(OnboardingRepository.name);
  }

  async createOnboarding(onboarding: Onboarding): Promise<Onboarding> {
    const doc = this.fromEntityToDoc(onboarding);
    return this.onboardingModel
      .create(doc)
      .then((docCreated) => {
        return this.fromDocToEntity(docCreated);
      })
      .catch((error) => {
        this.logger.error(
          `Unexpected error while creating an onboarding. onboardingId: ${onboarding.getOnboardingId} — ${error}`,
          error.stack,
        );
        throw new InternalServerErrorException(
          `Failed to create onboarding. onboardingId: ${onboarding.getOnboardingId()}`,
        );
      });
  }

  private fromEntityToDoc(onboarding: Onboarding): OnboardingDocument {
    return {
      onboardingId: onboarding.getOnboardingId(),
      state: onboarding.getState(),
    } as OnboardingDocument;
  }

  private fromDocToEntity(doc: OnboardingDocument): Onboarding {
    return Onboarding.builder()
      .setOnboardingId(doc.onboardingId)
      .setState(doc.state)
      .build();
  }
}
