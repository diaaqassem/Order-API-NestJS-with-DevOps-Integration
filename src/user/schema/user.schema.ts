import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
const bcrypt = require('bcryptjs');

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ unique: false })
  username: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({
    required: true,
    // select: false, //For Hidden Password
    minlength: [8, 'Password Must Be At least 8 characters'],
  })
  password: string;

  @Prop()
  resetCode: string;

  @Prop()
  resetCodeExpires: number;

  @Prop()
  resetVerified: boolean;

  @Prop()
  order: string;

  @Prop()
  orderStatus: string;

  @Prop()
  admin: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
    next();
  }
});
