import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { CustomHttpException } from '../exceptions/custom-http.exception';
import { User } from 'src/user/schema/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as jwt from 'jsonwebtoken';

@Injectable() 
export class AuthGuard implements CanActivate {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}
  async canActivate(context: ExecutionContext) {
    const request: any = context.switchToHttp().getRequest<Request>();
    let token;
    if (request.headers.cookie) {
      token = request.headers?.cookie.split('-')[1];
    }
    if (!token) {
      throw new CustomHttpException('No Token Provided\n please login.', 401);
    }

    let decode = await jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      throw new CustomHttpException('No Token Provided.', 401);
    }

    request['user'] = await this.UserModel.findById(decode.id);
    if (!request.user) {
      throw new CustomHttpException('User Not Found.', 404);
    }

    return true;
  }
}
