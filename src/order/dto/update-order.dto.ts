import { IsBoolean, IsDate, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateOrderDto {
  @IsOptional()
  @IsEnum(['Pending', 'Shipped', 'Delivered'])
  orderStatus?: string;

  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  deliveredAt?: Date;
}
