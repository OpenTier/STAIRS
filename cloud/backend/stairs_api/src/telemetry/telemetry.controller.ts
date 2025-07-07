import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { InfluxDbService } from '../influxdb/influxdb.service';
import { parseTimespanToSeconds } from './util/telemetry.util';
import { trace } from '@opentelemetry/api';

// Metrics that support aggregation for statistics (min / max / mean)
const metricsAgg = ['engine', 'battery', 'speed', 'tires'];

@ApiBearerAuth()
@ApiTags('fleet_management', 'telemetry')
@Controller('telemetry')
export class TelemetryController {
  constructor(private readonly influxDbService: InfluxDbService) {}

  @Get()
  @ApiOperation({
    summary: 'Get aggregated metrics for each device based on the needed time',
  })
  async getTelemetryData(
    @Query('timespan') timespan: string = '-1h',
    @Query('aggFunc') aggFunc: string = 'max',
  ) {
    // Prepare queries - aggregated metrics are now numbers => no need to convert in the query
    const fluxQueries = metricsAgg.map(
      (measurement) => `from(bucket: "telemetry") \
    |> range(start: ${timespan || '-1s'}) \
    |> filter(fn: (r) => r._measurement == "${measurement}") \
    |> group(columns: ["device_id", "_field"]) \
    |> ${aggFunc}()`,
    );

    // Execute queries
    const tracer = trace.getTracer('telemetry-aggregated');
    let result;
    await tracer.startActiveSpan('telemetry-db-operation', async (span) => {
      result = await Promise.all(
        fluxQueries.map((fluxQuery) =>
          this.influxDbService.queryData(fluxQuery),
        ),
      );
      span.end();
    });

    // Flatten the measurement results into a single array
    return result.flat();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get last telemetry samples for a device based on the needed time',
  })
  @ApiResponse({ status: 200, description: 'Return the telemtry results' })
  //@ApiResponse({ status: 404, description: 'Device not found.' })
  async getDeviceTelemetryData(
    @Param('id') id: number,
    @Query('timespan') timespan: string = '-10s', // to substitude for any latency in frontend cycle
    @Query('nbSamples') nbSamples: number = 1, // default: last sample
    @Query('aggFunc') aggFunc: string = 'mean',
  ) {
    const tracer = trace.getTracer('telemetry-device');
    // Get the window time for 1 sample
    // Convert timespan to seconds
    // Convert timespan to seconds dynamically
    const timespanSeconds = parseTimespanToSeconds(timespan);
    //console.log(timespanSeconds);
    // Calculate window duration in seconds
    const windowDurationSeconds = Math.ceil(timespanSeconds / nbSamples);
    //console.log(windowDurationSeconds);

    // Prepare queries
    const metricsNoAgg = ['lock_state', 'location']; // metrics in which we are interested in the last values

    const fluxQueriesAgg = metricsAgg.map(
      (measurement) => `from(bucket: "telemetry") \
      |> range(start: ${timespan || '-1s'}) \
      |> filter(fn: (r) => r._measurement == "${measurement}") \
      |> filter(fn: (r) => r.device_id == "${id}")
      |> aggregateWindow(every: ${windowDurationSeconds}s, fn: ${aggFunc})
      |> filter(fn: (r) => exists r._value)
      |> limit(n: ${nbSamples})`,
    );
    const fluxQueriesNoAgg = metricsNoAgg.map(
      (measurement) => `from(bucket: "telemetry") \
      |> range(start: ${timespan || '-1s'}) \
      |> filter(fn: (r) => r._measurement == "${measurement}") \
      |> filter(fn: (r) => r.device_id == "${id}")
      |> limit(n: 1)`,
    );

    // Execute queries
    let resultAgg;
    await tracer.startActiveSpan('telemetry-db-operation', async (span) => {
      resultAgg = await Promise.all(
        fluxQueriesAgg.map((fluxQuery) =>
          this.influxDbService.queryData(fluxQuery),
        ),
      );
      span.end();
    });

    let resultNoAgg;
    await tracer.startActiveSpan('telemetry-db-operation', async (span) => {
      resultNoAgg = await Promise.all(
        fluxQueriesNoAgg.map((fluxQuery) =>
          this.influxDbService.queryData(fluxQuery),
        ),
      );
      span.end();
    });

    // Flatten the measurement results into a single array
    return [...resultAgg.flat(), ...resultNoAgg.flat()];
  }

  @Get('maps/locations')
  @ApiOperation({
    summary: 'Get latest location for the devices',
  })
  @ApiResponse({ status: 200, description: 'Return the location results' })
  async getLocations() {
    // Prepare query
    const fluxQuery = `from(bucket: "telemetry") \
  |> range(start: -1h) \
  |> filter(fn: (r) => r._measurement == "location") \
  |> filter(fn: (r) => r._field == "latitude" or r._field == "longitude") \
  |> group(columns: ["device_id", "_field"]) \
  |> last()`;

    // Execute query
    const tracer = trace.getTracer('locations-all');
    let result;
    await tracer.startActiveSpan('telemetry-db-operation', async (span) => {
      result = await this.influxDbService.queryData(fluxQuery);
      span.end();
    });
    return result;
  }

  @Get(':id/maps/locations')
  @ApiOperation({
    summary: 'Get locations history for a specific device',
  })
  @ApiResponse({ status: 200, description: 'Return the location results' })
  async getDeviceLocationHistory(@Param('id') id: number) {
    // Prepare query
    const fluxQuery = `from(bucket: "telemetry") \
  |> range(start: -1h) \
  |> filter(fn: (r) => r._measurement == "location") \
  |> filter(fn: (r) => r._field == "latitude" or r._field == "longitude") \
  |> filter(fn: (r) => r.device_id == "${id}") \
  |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value") \
  |> sort(columns: ["_time"], desc: false)`;

    // Execute query
    const tracer = trace.getTracer('locations-device');
    let result;
    await tracer.startActiveSpan('telemetry-db-operation', async (span) => {
      result = await this.influxDbService.queryData(fluxQuery);
      span.end();
    });
    return result;
  }
}
