// Copyright (c) 2025 by OpenTier GmbH
// SPDX‑FileCopyrightText: 2025 OpenTier GmbH
// SPDX‑License‑Identifier: MIT
//
// This file is part of OpenTier.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

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
    .setTitle('STAIRS API')
    .setDescription('STAIRS API docs with NestJS + Swagger')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    explorer: true,
    customSiteTitle: 'STAIRS API Docs',
  });

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
