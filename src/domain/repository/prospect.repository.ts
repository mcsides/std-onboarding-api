import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProspectDocument } from './schema/prospect-document.schema';
import { Prospect } from '../entity/prospect';
import { Logger } from '@nestjs/common';

@Injectable()
export class ProspectRepository {
  private readonly logger: Logger;

  constructor(
    @InjectModel(ProspectDocument.name)
    private readonly prospectModel: Model<ProspectDocument>,
  ) {
    this.logger = new Logger(ProspectRepository.name);
  }

  async findByEmail(email: string): Promise<Prospect | undefined> {
    return this.prospectModel
      .findOne({ email })
      .exec()
      .then((prospectDocumentFound) => {
        if (prospectDocumentFound) {
          this.logger.debug(
            `Prospect found by email: ${prospectDocumentFound.email} — id: ${prospectDocumentFound.id}`,
          );
          return this.fromDocToEntity(prospectDocumentFound);
        } else {
          this.logger.warn(`Prospect not found by email: ${email}`);
          return undefined;
        }
      })
      .catch((error) => {
        this.logger.error(
          `Unexpected error while fetching prospect by email: ${email} — ${error}`,
          error.stack,
        );
        throw new InternalServerErrorException(
          `Failed to fetch prospect by email: ${email}`,
        );
      });
  }

  private fromDocToEntity(prospectDoc: ProspectDocument): Prospect {
    return new Prospect(prospectDoc.prospectId, prospectDoc?.email);
  }
}
