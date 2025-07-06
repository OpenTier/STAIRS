import { Module } from '@nestjs/common';
import { InfluxDbService } from './influxdb.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [InfluxDbService],
  exports: [InfluxDbService],
})
export class InfluxDbModule {}
