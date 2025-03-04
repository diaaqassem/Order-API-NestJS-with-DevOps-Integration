import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterUserDto } from './dto/register-user.dto';
import { MongoId } from './dto/mongo-id.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CustomHttpException } from 'src/common/exceptions/custom-http.exception';
import { Response } from 'express';
import { generateToken } from 'src/common/services/jwt.service';
const crypto = require('crypto');
import * as dotenv from 'dotenv';
import { Model } from 'mongoose';
import { SendEmail } from 'src/common/services/send-email.service';

dotenv.config();
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    private readonly sendEmail: SendEmail,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<string> {
    await new this.UserModel(registerUserDto).save();
    const msg = `Register successfully\n please login: ${process.env.APP_URL}/user/login`;
    return msg;
  }

  async login(email, password, response: Response) {
    const user: any = await this.UserModel.findOne({ email });
    if (!user) throw new CustomHttpException('Invalid Credentials', 400);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new CustomHttpException('Invalid Credentials', 400);
    } else {
      const token = generateToken(user._id);

      const cookiesOPtions = {
        expires: new Date(
          Date.now() + Number(process.env.JWT_EXPIRES_IN) * 1000,
        ),
        httpOnly: true,
      };

      response.cookie('token', `Bearer-${token}`, cookiesOPtions);
      response.send({
        message: 'Login successful',
        token,
        user: new UserResponseDto(user._doc),
      });
    }
  }

  async findUsers(): Promise<User[]> {
    return await this.UserModel.find({}).select('username email -_id').lean();
  }

  async updateUser(id: MongoId, updateUserDto: UpdateUserDto): Promise<User> {
    const updateData = { ...updateUserDto };
    if ('password' in updateData) {
      delete updateData.password;
    }
    const user = await this.UserModel.findByIdAndUpdate(id, updateData, {
      new: true,
    }).exec();
    if (!user) {
      throw new CustomHttpException(`Not Found User ${id}`, 400);
    }
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    await this.UserModel.findByIdAndDelete(id).exec();
  }

  /* 
    Desc: Forget Password And Send Code To User
*/
  async forgetPassword(email) {
    const user = await this.UserModel.findOne({ email });
    if (!user) throw new CustomHttpException('Invalid Credentials', 400);
    // if user exist , generate random 6 digit , and save it in DB
    const resetCode = Math.floor(100000 + Math.random() * 900000)
      .toString()
      .slice(0, 6);

    const hashedResetCode = crypto
      .createHash('sha256')
      .update(resetCode)
      .digest('hex');
    user.resetCode = hashedResetCode;
    //  add expiration time for password reset code (10m)
    user.resetCodeExpires = Date.now() + 10 * 60 * 1000;
    user.resetVerified = false;
    await user.save();
    try {
      await this.sendEmail.forgetPassword(user, resetCode);
    } catch (err) {
      user.resetCode = undefined;
      user.resetCodeExpires = undefined;
      user.resetVerified = undefined;
      await user.save();
      return new CustomHttpException('Cannot Send Reset Password Email', 500);
    }
    const msg = {
      status: 'success',
      message: `A password Reset Code Has been Sent To Your Email.`,
      warn: 'If You Dont Found Message Check Spam Messages',
      nextURL: `${process.env.APP_URL}/user/verifyResetCode`,
    };
    return msg;
  }
  // 2) Verify Reset Code For Forget Password
  async verifyResetCode(resetCode) {
    const hashedResetCode = crypto
      .createHash('sha256')
      .update(resetCode)
      .digest('hex');
    console.log('reset ', hashedResetCode);

    const user = await this.UserModel.findOne({
      resetCode: hashedResetCode,
      resetCodeExpires: { $gt: Date.now() },
    });
    if (!user) {
      throw new CustomHttpException('Invalid reset code', 404);
    }
    
    user.resetVerified = true;
    await user.save();
    const msg = {
      status: 'success',
      message: `Password reset code has been verified`,
      nextUrl: `${process.env.APP_URL}/user/resetPassword`,
    };
    return msg;
  }
  // 3) Reset Password
  async resetPassword(email, password, passwordConfirmation) {
    // Check Token And Expiration
    const user = await this.UserModel.findOne({
      email,
      resetVerified: true,
      resetCodeExpires: { $gt: Date.now() },
    });
    if (!user) {
      return new CustomHttpException(`invalid token!!`, 400);
    }

    if (password !== passwordConfirmation) {
      return new CustomHttpException('Passwords do not match', 400);
    }

    if (password === passwordConfirmation) {
      user.password = password;
      user.resetCode = undefined;
      user.resetCodeExpires = undefined;
      user.resetVerified = undefined;
      await user.save();
    } else {
      return new CustomHttpException(
        'Error in saving new password to database',
        500,
      );
    }

    const msg = {
      status: 'success',
      message: `Password has been reset\nPlease login again`,
    };
    return msg;
  }
}
