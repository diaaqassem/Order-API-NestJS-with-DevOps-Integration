import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { CustomHttpException } from '../exceptions/custom-http.exception';

@Injectable()
export class IsAdmin implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // access status (metadata by using reflector)
    const accessStatus = this.reflector.get<boolean>(
      'IS_ADMIN',
      context.getHandler(), // metadata for route
    );
    const request: any = context.switchToHttp().getRequest<Request>();

    if (request['user'].admin) {
      if (accessStatus === request['user'].admin) {
        return true;
      }
    }
    throw new CustomHttpException('No Permission To Access This Layer', 403);
  }
}
