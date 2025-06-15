import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TypedEnvConfig } from './config/typed.env.config';

async function bootstrap() {
  const swaggerOptions = new DocumentBuilder()
    .setTitle('Plan-it Challenge')
    .setDescription('Plan-it NodeJS Challenge')
    .setVersion('1.0')
    .addTag('Clients')
    .build();
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'verbose', 'debug'],
    cors: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const envConfig: TypedEnvConfig = app.get(TypedEnvConfig);
  const basePrefix: string = envConfig.config.BASE_PREFIX;
  const port: number = envConfig.config.PORT;
  app.setGlobalPrefix(basePrefix);
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup(`${basePrefix}/docs`, app, swaggerDocument);
  await app.listen(port);
  Logger.log(`Listen to port: ${port}`);
  Logger.log(`Docs URL: ${envConfig.config.BASE_URL}/docs`);
}
bootstrap();
