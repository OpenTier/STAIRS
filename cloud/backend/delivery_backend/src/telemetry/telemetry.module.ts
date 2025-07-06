import { Module } from '@nestjs/common';
import { TelemetryController } from './telemetry.controller';
import { InfluxDbModule } from 'src/influxdb/influxdb.module';

@Module({
  imports: [InfluxDbModule],
  controllers: [TelemetryController],
})
export class TelemetryModule {}
