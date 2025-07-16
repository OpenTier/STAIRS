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

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { DevicesModule } from './devices/devices.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { InfluxDbModule } from './influxdb/influxdb.module';
import { TelemetryModule } from './telemetry/telemetry.module';
import { CommandsModule } from './commands/commands.module';
import { AuthModule } from './auth/auth.module';

const authEnabled = process.env.AUTH_ENABLED === 'true';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`, // Automatically loads the corresponding .env file
      validationSchema: Joi.object({
        INFLUXDB_HOST: Joi.string().required(),
        INFLUXDB_TOKEN: Joi.string().required(),
        INFLUXDB_BUCKET: Joi.string().required(),
        INFLUXDB_ORG: Joi.string().required(),
        POSTGRESQL_HOST: Joi.string().required(),
        POSTGRESQL_PORT: Joi.number().required(),
        POSTGRESQL_USER: Joi.string().required(),
        POSTGRESQL_PASSWORD: Joi.string().required(),
        POSTGRESQL_DATABASE: Joi.string().required(),
        BACKEND_PORT: Joi.number().required(),
        BACKEND_HOSTNAME: Joi.string().required(),
        PRODUCTION: Joi.boolean().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRESQL_HOST'),
        port: configService.get<number>('POSTGRESQL_PORT'),
        username: configService.get<string>('POSTGRESQL_USER'),
        password: configService.get<string>('POSTGRESQL_PASSWORD'),
        database: configService.get<string>('POSTGRESQL_DATABASE'),
        autoLoadEntities: true,
        synchronize: configService.get<boolean>('PRODUCTION'),
        logging: true,
      }),
    }),
    UsersModule,
    ...(authEnabled ? [AuthModule] : []),
    DevicesModule,
    InfluxDbModule,
    TelemetryModule,
    CommandsModule,
  ],
})
export class AppModule {}
