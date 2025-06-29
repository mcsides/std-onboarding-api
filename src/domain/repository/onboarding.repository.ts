import { Injectable } from '@nestjs/common';
import { Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OnboardingDocument } from './schema/onboarding-document.schema';
import { Model } from 'mongoose';
import { Onboarding } from '../entity/onboarding';
import { OnboardingStatus } from '../entity/onboarding-status.enum';

@Injectable()
export class OnboardingRepository {
  private readonly logger: Logger;
  constructor(
    @InjectModel(OnboardingDocument.name)
    private readonly onboardingModel: Model<OnboardingDocument>,
  ) {
    this.logger = new Logger(OnboardingRepository.name);
  }

  async findBy(payload: Record<string, any>): Promise<Onboarding | void> {
    return this.onboardingModel
      .findOne(payload)
      .exec()
      .then((onboardingFound) => {
        if (onboardingFound) {
          this.logger.debug(`Onboarding found by criteria: ${JSON.stringify(payload)}`);
          return this.fromDocToEntity(onboardingFound);
        } else {
          this.logger.debug(`Onboarding not found by criteria: ${JSON.stringify(payload)}`);
          return undefined;
        }
      })
      .catch((error) => {
        this.logger.error(`Unexpected error while fetching onboarding by criteria: ${JSON.stringify(payload)} `, error);
        throw new InternalServerErrorException(`Failed to fetch onboarding by criteria: ${JSON.stringify(payload)}`);
      });
  }

  async createOnboarding(onboarding: Onboarding): Promise<Onboarding> {
    const doc = this.fromEntityToDoc(onboarding);
    const onboardingId = onboarding.getOnboardingId();
    return this.onboardingModel
      .create(doc)
      .then((docCreated) => {
        this.logger.debug(`Onboarding created with id: ${onboardingId} and email: ${docCreated.email}`);
        return this.fromDocToEntity(docCreated);
      })
      .catch((error) => {
        this.logger.error(`Unexpected error while creating an onboarding. onboardingId: ${onboardingId} `, error);
        throw new InternalServerErrorException(`Failed to create onboarding. onboardingId: ${onboardingId}`);
      });
  }

  async patch(onboardingId: string, status :OnboardingStatus): Promise<Onboarding> {
    this.logger.debug(`Updating onboarding with id: ${onboardingId} to status: ${status}`);
    return this.onboardingModel.findOneAndUpdate(
      { onboardingId: onboardingId },
      { $set: { status: status } },
      { new: true }
    ).then((docUpdated) => {
      if (!docUpdated) {
        this.logger.error(`Onboarding not found for update - onboardingId: ${onboardingId}`);
        throw new InternalServerErrorException(`Onboarding not found for update  - onboardingId: ${onboardingId}`);
      } else {
        this.logger.debug(`Onboarding found and updated - onboardingId: ${onboardingId}`);
        return this.fromDocToEntity(docUpdated);
      }
    }).catch((error) => {
      this.logger.error(`Unexpected error while updating onboarding - onboardingId: ${onboardingId}`, error);
      throw new InternalServerErrorException(`Failed to update onboarding - onboardingId: ${onboardingId}`);
    });
  }

  private fromEntityToDoc(onboarding: Onboarding): OnboardingDocument {
    return {
      onboardingId: onboarding.getOnboardingId(),
      status: onboarding.getStatus(),
      email: onboarding.getEmail(),
    } as OnboardingDocument;
  }

  private fromDocToEntity(doc: OnboardingDocument): Onboarding {
    return Onboarding.builder()
      .setOnboardingId(doc.onboardingId)
      .setStatus(OnboardingStatus[doc.status as keyof typeof OnboardingStatus])
      .setEmail(doc.email)
      .build();
  }
}
