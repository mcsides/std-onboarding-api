import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'onboarding' })
export class OnboardingDocument {
  @Prop({ required: true, unique: true })
  onboardingId: string;
  @Prop({ required: true })
  state: string;
  @Prop({ required: false, unique: true })
  email?: string;
  @Prop({ required: false, unique: true })
  mobile?: number;
}

export const OnboardingSchema =
  SchemaFactory.createForClass(OnboardingDocument);
