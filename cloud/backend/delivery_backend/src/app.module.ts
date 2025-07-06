import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { TripsModule } from './trips/trips.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { InfluxDbModule } from './influxdb/influxdb.module';
import { TelemetryModule } from './telemetry/telemetry.module';
import { CommandsModule } from './commands/commands.module';

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
        SKIP_SIMULATED_VEHICLES: Joi.boolean(),
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
    // AuthModule, TODO: for development Auth is turned off for now
    VehiclesModule,
    TripsModule,
    InfluxDbModule,
    TelemetryModule,
    CommandsModule,
  ],
})
export class AppModule {}
