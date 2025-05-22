import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'prospects' })
export class ProspectDocument {
  @Prop({ required: true, unique: true })
  prospectId: string;
  @Prop({ required: true, unique: true })
  email: string;
}

export const ProspectSchema = SchemaFactory.createForClass(ProspectDocument);
