import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'onboarding' })
export class OnboardingDocument {
  @Prop({ required: true, unique: true })
  onboardingId: string;
  @Prop({ required: true })
  status: string;
  @Prop({ required: true, unique: true })
  email: string;
  @Prop()
  mobile?: number;
}

export const OnboardingSchema =
  SchemaFactory.createForClass(OnboardingDocument);
