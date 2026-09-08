import { AppModule } from './app.module';
import { config } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { validationExceptionFactory } from './utils/validation';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  config(); // Load .env file

  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: validationExceptionFactory,
    }),
  );

  const swaggerDocumentConfig = new DocumentBuilder()
    .setTitle('Divisão de Contas')
    .setDescription('Divisão de Compras')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, swaggerDocumentConfig);
  SwaggerModule.setup('swagger', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json',
  });

  await app.listen(process.env.PORT ?? 8000);
}

void bootstrap();
