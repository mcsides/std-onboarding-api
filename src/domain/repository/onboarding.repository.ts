import { Injectable } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OnboardingDocument } from './schema/onboarding-document.schema';
import { Model } from 'mongoose';
import { Onboarding } from '../entity/onboarding';
import { OnboardingStatus } from '../entity/onboarding-status.enum';
import { InjectPinoLogger } from 'nestjs-pino';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class OnboardingRepository {
  constructor(
    @InjectPinoLogger(OnboardingRepository.name)
    private readonly logger: PinoLogger,
    @InjectModel(OnboardingDocument.name)
    private readonly onboardingModel: Model<OnboardingDocument>,
  ) {}

  async findByIdAndEmail(
    onboardingId: string,
    email: string,
  ): Promise<Onboarding | undefined> {
    return this.onboardingModel
      .findOne({ onboardingId, email })
      .exec()
      .then((onboardingFound) => {
        if (onboardingFound) {
          this.logger.debug(
            { onboardingId, email },
            'Onboarding found by email.',
          );
          return this.fromDocToEntity(onboardingFound);
        } else {
          this.logger.debug(
            { onboardingId, email },
            'Onboarding not found by email:',
          );
          return undefined;
        }
      })
      .catch((error) => {
        this.logger.error(
          { onboardingId, email },
          'Unexpected error while fetching onboarding by email',
          error,
        );
        throw new InternalServerErrorException(
          'Failed to fetch onboarding by email.',
        );
      });
  }

  async findByIdAndEmailAndStatus(
    onboardingId: string,
    email: string,
    status: OnboardingStatus,
  ): Promise<Onboarding | undefined> {
    return this.onboardingModel
      .findOne({ onboardingId, email, status: status })
      .exec()
      .then((onboardingFound) => {
        if (onboardingFound) {
          this.logger.debug(
            { onboardingId, email, status: status },
            'Onboarding found by email and status.',
          );
          return this.fromDocToEntity(onboardingFound);
        } else {
          this.logger.debug(
            { onboardingId, email, status: status },
            'Onboarding not found by email and status.',
          );
          return undefined;
        }
      })
      .catch((error) => {
        this.logger.error(
          { onboardingId, email, status: status },
          'Unexpected error while fetching onboarding by email and status',
          error,
        );
        throw new InternalServerErrorException(
          'Failed to fetch onboarding by email and status.',
        );
      });
  }

  async findByMobile(mobile: string): Promise<Onboarding | undefined> {
    return this.onboardingModel
      .findOne({ mobile })
      .exec()
      .then((onboardingFound) => {
        if (onboardingFound) {
          this.logger.debug({ mobile }, 'Onboarding found by mobile.');
          return this.fromDocToEntity(onboardingFound);
        } else {
          this.logger.debug({ mobile }, 'Onboarding not found by mobile:');
          return undefined;
        }
      })
      .catch((error) => {
        this.logger.error(
          { mobile },
          'Unexpected error while fetching onboarding by mobile',
          error,
        );
        throw new InternalServerErrorException(
          'Failed to fetch onboarding by mobile.',
        );
      });
  }

  async findByIdAndStatus(
    onboardingId: string,
    status: OnboardingStatus,
  ): Promise<Onboarding | undefined> {
    return this.onboardingModel
      .findOne({ onboardingId, status })
      .exec()
      .then((onboardingFound) => {
        if (onboardingFound) {
          this.logger.debug(
            { onboardingId, status },
            'Onboarding found by status.',
          );
          return this.fromDocToEntity(onboardingFound);
        } else {
          this.logger.debug(
            { onboardingId, status },
            'Onboarding not found by status:',
          );
          return undefined;
        }
      })
      .catch((error) => {
        this.logger.error(
          { onboardingId, status },
          'Unexpected error while fetching onboarding by status',
          error,
        );
        throw new InternalServerErrorException(
          'Failed to fetch onboarding by status.',
        );
      });
  }

  async createOnboarding(onboarding: Onboarding): Promise<Onboarding> {
    const doc = this.fromEntityToDoc(onboarding);
    return this.onboardingModel
      .create(doc)
      .then((docCreated) => {
        this.logger.debug(
          { onboardingId: docCreated.onboardingId, email: docCreated.email },
          'Onboarding created.',
        );
        return this.fromDocToEntity(docCreated);
      })
      .catch((error) => {
        this.logger.error(
          {
            onboardingId: onboarding.getOnboardingId(),
            email: onboarding.getEmail(),
          },
          'Unexpected error while creating onboarding.',
          error,
        );
        throw new InternalServerErrorException('Failed to create onboarding.');
      });
  }

  async patch(
    onboardingId: string,
    status: OnboardingStatus,
  ): Promise<Onboarding> {
    return this.onboardingModel
      .findOneAndUpdate(
        { onboardingId: onboardingId },
        { $set: { status: status } },
        { new: true },
      )
      .then((docUpdated) => {
        if (!docUpdated) {
          this.logger.error(
            { onboardingId },
            'Onboarding not found for update',
          );
          throw new InternalServerErrorException(
            'Onboarding not found for update',
          );
        } else {
          this.logger.debug({ onboardingId }, 'Onboarding found and updated');
          return this.fromDocToEntity(docUpdated);
        }
      })
      .catch((error) => {
        this.logger.error(
          { onboardingId },
          'Unexpected error while updating onboarding',
          error,
        );
        throw new InternalServerErrorException('Failed to update onboarding}');
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
