import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { I18n, I18nContext } from 'nestjs-i18n';
export class RegisterUserDto {
  @IsString()
  @Length(2, 30, {
    message: (args) => I18nContext.current().translate('validation.NAME'),
    context: {
      errorCode: 1003,
      developerNote: 'The validated string must contain 32 or more characters.',
    },
  })
  readonly username: string;

  @IsEmail(
    {},
    {
      message: (args) =>
        I18nContext.current().translate('validation.EMAIL_NOT_FORMATTED'),
    },
  )
  readonly email: string;

  @IsString({
    message: (args) => I18nContext.current().translate('validation.PASSWORD'),
  })
  readonly password: string;

  @IsString({
    message: (args) => I18nContext.current().translate('validation.RESETCODE'),
  })
  @IsOptional()
  readonly resetCode?: string;

  @IsString()
  @IsOptional()
  readonly passwordExpire?: string;

  @IsString()
  @IsOptional()
  readonly passwordConfirmation?: string;

  @IsBoolean()
  @IsOptional()
  readonly admin?: boolean;
}
