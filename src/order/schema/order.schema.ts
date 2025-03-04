import mongoose, { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  ShippingAddress,
  ShippingAddressSchema,
} from './shipping-address.schema';
import { IsOptional } from 'class-validator';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: mongoose.Types.ObjectId;

  @Prop({
    type: [
      {
        product: {
          type: MongooseSchema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        _id: false,
      },
    ],
    required: true,
    default: [],
  })
  items: {
    product: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
  }[];

  @Prop({ type: Number, default: 12 })
  shippingPrice: number;

  @Prop({ type: ShippingAddressSchema, required: true })
  shippingAddress: ShippingAddress;

  @Prop({ type: Number })
  totalPrice: number;

  @Prop({ enum: ['pending', 'shipped', 'delivered'], default: 'pending' })
  @IsOptional()
  orderStatus?: string;

  @Prop({ default: false })
  @IsOptional()
  isPaid?: boolean;

  @Prop({ type: Date })
  deliveredAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.pre(/^find/, function (next) {
  const order: any = this;
  order
    .populate({ path: 'user', select: 'username email -_id' })
    .populate({ path: 'items.product', select: 'name description price _id' });
  next();
});
