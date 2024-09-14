import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './utils/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { ProductModule } from './product/product/product.module';
import { ProductCategoryModule } from './product/product-category/product-category.module';
import { ProductTagModule } from './product/product-tag/product-tag.module';
import * as winston from 'winston';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WinstonModule.forRoot({
      format: winston.format.json(),
      level: 'info',
      transports: [new winston.transports.Console()],
    }),
    DatabaseModule,
    ProductModule,
    ProductCategoryModule,
    ProductTagModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
