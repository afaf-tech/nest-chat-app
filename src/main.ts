import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerOptions = new DocumentBuilder()
    .setTitle('Chat App API')
    .setDescription('API documentation for the Chat App')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('api-docs', app, document);

  app.enableCors({
    origin: [
       'http://127.0.0.1:5500',
       'http://127.0.0.1:8080',
       'http://localhost:8080',
       'http://127.0.0.1:80',
       'http://localhost:80',
    ],
    methods: ["GET", "POST"],
    credentials: false,
  });
  await app.listen(3000);
}
bootstrap();
