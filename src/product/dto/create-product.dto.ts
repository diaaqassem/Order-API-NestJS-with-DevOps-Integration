import { IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { I18nContext } from 'nestjs-i18n';

export class CreateProductDto {
  @IsString()
  @Length(2, 20, {
    message: (args) => I18nContext.current().translate('validation.NAME'),
  })
  readonly name: string;

  @IsString({
    message: (args) => I18nContext.current().translate('validation.STR'),
  })
  readonly description: string;

  @IsString({ message: 'imageCover must be string' })
  @IsOptional()
  imageCover?: string;

  @IsNumber()
  readonly price: number;

  @IsNumber()
  readonly sold: number;

  @IsNumber()
  @IsOptional()
  readonly priceAfterDiscount?: number;

  @IsNumber()
  @IsOptional()
  readonly quantity?: number;

  @IsString({
    message: (args) => I18nContext.current().translate('validation.MONGOID'),
  })
  readonly category: string;
}
