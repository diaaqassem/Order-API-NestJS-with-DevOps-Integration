import {
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsEnum,
  ValidateNested,
  IsString,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { I18nContext } from 'nestjs-i18n';

export class ShippingAddressDto {
  @IsString({
    message: (args) => I18nContext.current().translate('validation.STR'),
  })
  details: string;

  @IsString({
    message: (args) => I18nContext.current().translate('validation.PHONE'),
  })
  phone: string;

  @IsString({
    message: (args) => I18nContext.current().translate('validation.STR'),
  })
  city: string;
}

export class CreateOrderDto {
  @IsOptional()
  user: string;

  @IsNotEmpty()
  items: { product: string; quantity: number; price: number }[];

  @IsNumber()
  @IsNotEmpty()
  shippingPrice: number;

  @ValidateNested()
  @Type(() => ShippingAddressDto)
  @IsNotEmpty()
  shippingAddress: ShippingAddressDto;

  @IsNumber()
  @IsOptional()
  totalPrice?: number;

  @IsEnum(['Pending', 'Shipped', 'Delivered'])
  orderStatus: string;

  @IsBoolean()
  isPaid: boolean;
}
