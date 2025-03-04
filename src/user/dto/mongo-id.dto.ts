import { IsMongoId } from 'class-validator';
import { I18nContext } from 'nestjs-i18n';

export class MongoId {
  @IsMongoId({
    message: (args) => I18nContext.current().translate('validation.MONGOID'),
  })
  id: string;
}
