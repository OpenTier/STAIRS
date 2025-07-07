import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import './monitoring/otel-logging';
import { setupConsoleLogInterceptor } from './monitoring/custom-console';
import { setupTracing } from './monitoring/otel-tracing';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Setup Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Fleet Management API')
    .setDescription('The API for the Fleet Management System')
    .setVersion('1.0')
    .addTag('fleet_management')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Setup and start the application
  const port = configService.get<number>('BACKEND_PORT', 3000);
  const hostname = configService.get<string>('BACKEND_HOSTNAME', 'localhost');

  app.enableCors();
  await app.listen(port, hostname);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
setupConsoleLogInterceptor();
setupTracing();
bootstrap();
