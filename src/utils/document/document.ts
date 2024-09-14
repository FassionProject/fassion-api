import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const swaggerConfig = new DocumentBuilder()
  .setTitle('Fassion API')
  .setDescription('The Fassion API description')
  .setVersion('1.0')
  .addTag('Product')
  .addTag('ProductCategory')
  .addTag('ProductTag')
  .build();

export class Document {
  static setup(app: INestApplication) {
    const factory = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('swagger', app, factory);
  }
}
