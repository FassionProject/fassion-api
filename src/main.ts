import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as cookieParser from 'cookie-parser';
import { LoggerInterceptor } from './utils/logger/logger/logger.interceptor';
import * as winston from 'winston';
import { createLogger, format, transports } from 'winston';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
const { combine, timestamp, prettyPrint } = format;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  // Logger Service
  const loggerService = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(loggerService);

  const logger = createLogger({
    level: 'info',
    format: combine(timestamp(), format.json()),
    transports: [new winston.transports.Console()],
  });

  app.useGlobalInterceptors(new LoggerInterceptor(logger));

  const config = new DocumentBuilder()
    .setTitle('Fassion API')
    .setDescription('The Fassion API description')
    .setVersion('1.0')
    .addTag('Product')
    .addTag('ProductCategory')
    .addTag('ProductTag')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}
bootstrap();
