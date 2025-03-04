import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { CustomExceptionFilter } from './common/filters/custom-exception.filter';
import { I18nValidationPipe } from 'nestjs-i18n';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bodyParser: true,
  });
  const logger: Logger = new Logger('bootstrap');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new CustomExceptionFilter());
  app.useGlobalPipes(
    new I18nValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  await process.on('unhandledRejection', (err: any) => {
    logger.error(
      `Unhandled Rejection Error ! ,\n path : ${err.name} , message : ${err.message}\n`,
    );
    // app.close();
  });

  process.on('uncaughtException', (error: Error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
  });

  await app.listen(process.env.PORT ?? 3000, () => {
    logger.log('Application is running On URL:\n http://localhost:3000 ...');
  });
}
bootstrap();
