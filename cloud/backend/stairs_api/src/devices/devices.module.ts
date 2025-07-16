import { Module } from '@nestjs/common';
import { Device } from './device.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevicesController } from './devices.contoller';
import { DevicesService } from './devices.service';

@Module({
  imports: [TypeOrmModule.forFeature([Device])],
  providers: [DevicesService],
  controllers: [DevicesController],
  exports: [],
})
export class DevicesModule {}
