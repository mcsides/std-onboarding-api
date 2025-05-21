import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Email {
  @Prop({ required: true, unique: true })
  email: string;
}

export const EmailSchema = SchemaFactory.createForClass(Email);
