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

  async findByEmail(email: string): Promise<Onboarding | void> {
    return this.onboardingModel
      .findOne({ email })
      .exec()
      .then((onboardingFound) => {
        if (onboardingFound) {
          this.logger.debug(
            `Onboarding found by email: ${onboardingFound.email} — onboardingId: ${onboardingFound.onboardingId}`,
          );
          return this.fromDocToEntity(onboardingFound);
        } else {
          this.logger.warn(`Onboarding not found by email: ${email}`);
          return undefined;
        }
      })
      .catch((error) => {
        this.logger.error(
          `Unexpected error while fetching onboarding by email: ${email} — ${error}`,
          error.stack,
        );
        throw new InternalServerErrorException(
          `Failed to fetch onboarding by email: ${email}`,
        );
      });
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
      email: onboarding.getEmail(),
    } as OnboardingDocument;
  }

  private fromDocToEntity(doc: OnboardingDocument): Onboarding {
    return Onboarding.builder()
      .setOnboardingId(doc.onboardingId)
      .setState(doc.state)
      .setEmail(doc.email)
      .build();
  }
}
