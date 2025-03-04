import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ShippingAddressDocument = ShippingAddress & Document;

@Schema({ _id: false })
export class ShippingAddress {
  @Prop({ type: String, required: true })
  details: string;

  @Prop({ type: String, required: true })
  phone: string;

  @Prop({ type: String, required: true })
  city: string;
}

export const ShippingAddressSchema =
  SchemaFactory.createForClass(ShippingAddress);
