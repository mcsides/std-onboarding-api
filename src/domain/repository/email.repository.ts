// repositories/user.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Email } from './schema/email.schema';

@Injectable()
export class EmailRepository {
  constructor(@InjectModel(Email.name) private emailModel: Model<Document>) {}

  async findByEmail(email: string): Promise<Document | null> {
    return this.emailModel.findOne({ email }).exec();
  }
}
