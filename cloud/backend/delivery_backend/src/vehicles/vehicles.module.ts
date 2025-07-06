import { Module } from '@nestjs/common';
import { Vehicle } from './vehicle.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesController } from './vehicles.contoller';
import { VehiclesService } from './vehicles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle])],
  providers: [VehiclesService],
  controllers: [VehiclesController],
  exports: [],
})
export class VehiclesModule {}
