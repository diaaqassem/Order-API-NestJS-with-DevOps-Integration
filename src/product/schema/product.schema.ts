import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import * as dotenv from 'dotenv';
export type ProductDocument = HydratedDocument<Product>;

dotenv.config();
@Schema()
export class Product {
  @Prop({ unique: false })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    required: true,
  })
  price: number;

  @Prop()
  sold: number;

  @Prop()
  priceAfterDiscount: number;

  @Prop()
  imageCover: string;

  @Prop()
  quantity: number;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Category', required: true })
  category: mongoose.Types.ObjectId[];
  _id: any;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.pre(/^find/, function (next) {
  const user: any = this;
  user.populate({ path: 'category', select: 'name -_id' });
  next();
});
