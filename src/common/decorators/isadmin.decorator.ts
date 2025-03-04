import { SetMetadata } from '@nestjs/common';

export const isAdmin = () =>
  SetMetadata('IS_ADMIN', true);
