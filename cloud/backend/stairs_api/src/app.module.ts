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
