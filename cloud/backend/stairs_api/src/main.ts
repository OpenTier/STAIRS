// Copyright (c) 2025 by OpenTier GmbH
// SPDX-FileCopyrightText: 2025 OpenTier GmbH
// SPDX-License-Identifier: LGPL-3.0-or-later
//
// This file is part of OpenTier.
//
// This is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as
// published by the Free Software Foundation; either version 3 of the
// License, or (at your option) any later version.
//
// This is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public
// License along with this file.  If not, see <https://www.gnu.org/licenses/>.

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
