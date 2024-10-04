import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as cookieParser from 'cookie-parser';
import { JsonResponseInterceptor } from './utils/json-response/json-response.interceptor';
import { Document } from './utils/document/document';
import { HTTPLogInterceptor } from './utils/log/http-log.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  // Logger Service
  const loggerService = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(loggerService);

  app.useGlobalInterceptors(new HTTPLogInterceptor());
  app.useGlobalInterceptors(new JsonResponseInterceptor());

  Document.setup(app);

  app.enableCors({});

  await app.listen(3000);
}
bootstrap();
