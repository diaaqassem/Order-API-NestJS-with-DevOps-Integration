import { IsString, Length } from 'class-validator';
import { I18nContext } from 'nestjs-i18n';

export class CategoryDto {
  @IsString({ message: 'Category name is required' })
  @Length(2, 15, {
    message: (args) => I18nContext.current().translate('validation.NAME'),
  })
  readonly name: string;
}
