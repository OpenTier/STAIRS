import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { CreateVehicleDto } from './dto/create_vehicle.dto';
import { VehicleStatus, VehicleType } from './interfaces/vehicle.interfaces';
import seedVehicles from './data/vehicles.seed';
import { ConfigService } from '@nestjs/config';
import { trace } from '@opentelemetry/api';

@Injectable()
export class VehiclesService implements OnModuleInit {
  private skipSimulatedVehicles: boolean;

  constructor(
    @Inject(ConfigService) private configService: ConfigService,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {
    this.skipSimulatedVehicles = this.configService.get<boolean>(
      'SKIP_SIMULATED_VEHICLES',
    );
  }

  /// New: onModuleInit() automatically runs at module startup
  async onModuleInit() {
    await this.fillDBIfEmpty();
  }
  private async fillDBIfEmpty() {
    // 1) Check if “vehicles” table is empty
    const count = await this.vehicleRepository.count();
    if (count > 0) {
      console.log(
        `Vehicle table not empty (count=${count}), skipping seeding.`,
      );
      return;
    }

    console.log('Vehicle table is empty — seeding initial data…');
    // Arbitrary wait for vehicle gateway to be ready
    // This is a workaround to ensure the vehicle gateway is ready before seeding.
    await new Promise((resolve) => setTimeout(resolve, 20000));

    // 2) Use hardcoded seed data
    const rows = seedVehicles;

    // 3) Loop over each item and reuse create()
    for (const entry of rows) {
      try {
        await this.create({
          vin: entry.vin,
          type: entry.type,
          make: entry.make,
          model: entry.model,
          plate: entry.plate,
          color: entry.color,
          year: entry.year,
          image: entry.image,
          provisionStatus: entry.provisionStatus,
        });
        console.log(`Seeded vehicle VIN=${entry.vin}`);
      } catch (e) {
        console.error(`Failed to seed VIN=${entry.vin}: ${e.message}`);
      }
    }

    console.log('Seeding of vehicles complete.');
  }

  async findAll(): Promise<Vehicle[]> {
    return await this.vehicleRepository.find({
      order: {
        id: 'ASC', // To have the vehicle with the largest ID at the end
      },
    });
  }

  async findOne(id: number): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({ where: { id } });
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }
    return vehicle;
  }

  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    const tracer = trace.getTracer('vehicle-create');
    // Create the object from the received data
    let vehicle;
    await tracer.startActiveSpan('vehicle-db-operation', async (span) => {
      vehicle = this.vehicleRepository.create({
        ...createVehicleDto,
        createdOn: new Date(),
        lastModifiedOn: new Date(),
      });
      span.end();
    });

    // Data validation
    let existingVin;
    await tracer.startActiveSpan('vehicle-db-operation', async (span) => {
      existingVin = await this.vehicleRepository.findOne({
        where: { vin: createVehicleDto.vin },
      });
      span.end();
    });
    if (existingVin) {
      throw new BadRequestException(
        `Vehicle with VIN ${createVehicleDto.vin} already exists`,
      );
    }
    let existingPlate;
    await tracer.startActiveSpan('vehicle-db-operation', async (span) => {
      existingPlate = await this.vehicleRepository.findOne({
        where: { plate: createVehicleDto.plate },
      });
      span.end();
    });
    if (existingPlate) {
      throw new BadRequestException(
        `Vehicle with Plate ${createVehicleDto.plate} already exists`,
      );
    }

    // Save to the database
    try {
      await tracer.startActiveSpan('vehicle-db-operation', async (span) => {
        await this.vehicleRepository.save(vehicle);
        span.end();
      });
    } catch (error) {
      throw new BadRequestException(error);
    }

    // Post to the vehicle gateway
    // For now, ignore this for simulated vehicles (will give an error unless Carla is working)
    if (
      createVehicleDto.type === VehicleType.REAL ||
      (createVehicleDto.type === VehicleType.SIMULATED &&
        this.skipSimulatedVehicles == false)
    ) {
      try {
        const vehicleGwUrl = `${process.env.VEHICLE_GW}/vehicle`;
        let response;
        await tracer.startActiveSpan(
          'vehicle-gateway-interaction',
          async (span) => {
            response = await fetch(vehicleGwUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                type:
                  createVehicleDto.type === VehicleType.REAL
                    ? 'real'
                    : 'simulated',
                entity_id: vehicle.id.toString(),
                vin: createVehicleDto.vin,
              }),
            });
            console.debug(await response.json());
            span.end();
          },
        );

        if (!response.ok) {
          // Remove from DB to keep consistency
          await tracer.startActiveSpan('vehicle-db-operation', async (span) => {
            await this.vehicleRepository.delete(vehicle.id);
            span.end();
          });
          throw new BadRequestException(
            `Request was rejected by vehicle gateway`,
          );
        }
      } catch (error) {
        console.error('Exception while calling vehicle gateway', {
          message: error.message,
          stack: error.stack,
          cause: error.cause ?? undefined,
        });
        await tracer.startActiveSpan('vehicle-db-operation', async (span) => {
          await this.vehicleRepository.delete(vehicle.id);
          span.end();
        });
        throw new BadRequestException(
          'Error sending command to vehicle gateway:',
          error.message,
        );
      }
    }
    // Save to the database
    let result;
    await tracer.startActiveSpan('vehicle-db-operation', async (span) => {
      result = await this.vehicleRepository.save(vehicle);
      span.end();
    });
    return result;
  }

  async update(id: number, vehicleDto: CreateVehicleDto): Promise<Vehicle> {
    const tracer = trace.getTracer('vehicle-update');
    // 1) Find the vehicle
    let vehicle;
    await tracer.startActiveSpan('vehicle-db-operation', async (span) => {
      vehicle = await this.vehicleRepository.findOne({ where: { id } });
      span.end();
    });
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    // 2) Data validation (to have meaningful error messages instead of DB exceptions)
    let existingVin;
    await tracer.startActiveSpan('vehicle-db-operation', async (span) => {
      existingVin = await this.vehicleRepository.findOne({
        where: { vin: vehicleDto.vin },
      });
      span.end();
    });
    if (existingVin && existingVin.id !== id) {
      throw new BadRequestException(
        `Vehicle with VIN ${vehicleDto.vin} already exists`,
      );
    }
    let existingPlate;
    await tracer.startActiveSpan('vehicle-db-operation', async (span) => {
      existingPlate = await this.vehicleRepository.findOne({
        where: { plate: vehicleDto.plate },
      });
      span.end();
    });
    if (existingPlate && existingPlate.id !== id) {
      throw new BadRequestException(
        `Vehicle with Plate ${vehicleDto.plate} already exists`,
      );
    }

    // 3) Update its status at the gateway if needed
    if (vehicle.provisionStatus != vehicleDto.provisionStatus) {
      try {
        const endpoint =
          vehicleDto.provisionStatus === VehicleStatus.ACTIVE
            ? 'activate'
            : 'deactivate';
        const vehicleGwUrl = `${process.env.VEHICLE_GW}/vehicle/${vehicle.id}/${endpoint}`;

        let response;
        await tracer.startActiveSpan(
          'vehicle-gateway-interaction',
          async (span) => {
            response = await fetch(vehicleGwUrl, { method: 'POST' });
            console.debug(await response.json());
            span.end();
          },
        );

        if (!response.ok) {
          throw new BadRequestException(
            `Request was rejected by vehicle gateway`,
          );
        }
      } catch (error) {
        console.error(error);
        throw new BadRequestException(
          'Error sending command to vehicle gateway:',
          error.message,
        );
      }
    }

    vehicle = {
      ...vehicle,
      ...vehicleDto,
      lastModifiedOn: new Date(),
    };
    try {
      let result;
      await tracer.startActiveSpan('vehicle-db-operation', async (span) => {
        result = await this.vehicleRepository.save(vehicle);
        span.end();
      });
      return result;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(id: number): Promise<void> {
    const result = await this.vehicleRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }
  }
}
