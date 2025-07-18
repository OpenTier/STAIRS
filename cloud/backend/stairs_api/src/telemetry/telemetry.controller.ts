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

import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { InfluxDbService } from '../influxdb/influxdb.service';
import { parseTimespanToSeconds } from './util/telemetry.util';
import { trace } from '@opentelemetry/api';
import { TelemetryEntryDto } from './dto/telemetry_entry.dto';
import { Public } from 'src/auth/decorators/public.decorator';

// Metrics that support aggregation for statistics (min / max / mean)
const metricsAgg = ['engine', 'battery', 'speed', 'tires'];

@ApiTags('telemetry')
@Controller('telemetry')
export class TelemetryController {
  constructor(private readonly influxDbService: InfluxDbService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary:
      'Get a single aggregated measurement per configured metrics for each device',
  })
  @ApiResponse({
    status: 200,
    description: 'Retrieved aggregated measurements',
    type: [TelemetryEntryDto],
  })
  @ApiQuery({
    name: 'timespan',
    description: 'Measurement timespan (e.g. -1h, -5s, -5m ...). Default: -1h',
    required: false,
    type: String,
    schema: {
      type: 'string',
      default: '-1h',
    },
  })
  @ApiQuery({
    name: 'aggFunc',
    description: 'Aggregation function (max / min / mean). Default: max',
    required: false,
    type: String,
    schema: {
      type: 'string',
      default: 'max',
      enum: ['mean', 'sum', 'min', 'max'],
    },
  })
  async getTelemetryData(
    @Query('timespan') timespan: string = '-1h',
    @Query('aggFunc') aggFunc: 'mean' | 'sum' | 'min' | 'max' = 'max',
  ) {
    // Prepare queries - aggregated metrics are now numbers => no need to convert in the query
    const fluxQueries = metricsAgg.map(
      (measurement) => `from(bucket: "telemetry") \
    |> range(start: ${timespan}) \
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

  @Public()
  @Get(':id')
  @ApiOperation({
    summary:
      'Get the last measurements per configured metrics for a single device',
  })
  @ApiResponse({
    status: 200,
    description: 'Retrieved last measurements',
    type: [TelemetryEntryDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid number of samples',
  })
  @ApiParam({
    name: 'id',
    description: 'Device ID (1, 2, 3 ...). Default: 1',
    required: false,
    type: Number,
    schema: { type: 'integer', default: 1 },
  })
  @ApiQuery({
    name: 'timespan',
    description: 'Measurement timespan (e.g. -1h, -5s, -5m ...). Default: -10s',
    required: false,
    type: String,
    schema: { type: 'string', default: '-10s' },
  })
  @ApiQuery({
    name: 'nbSamples',
    description: 'Number of samples to retrieve. Default: 1 (last sample)',
    required: false,
    type: Number,
    schema: { type: 'integer', default: 1 },
  })
  @ApiQuery({
    name: 'aggFunc',
    description: 'Aggregation function (max / min / mean). Default: mean',
    required: false,
    type: String,
    schema: {
      type: 'string',
      default: 'mean',
      enum: ['mean', 'sum', 'min', 'max'],
    },
  })
  async getDeviceTelemetryData(
    @Param('id') id: number = 1,
    @Query('timespan') timespan: string = '-10s',
    @Query('nbSamples') nbSamples: number = 1, // default: last sample
    @Query('aggFunc') aggFunc: 'mean' | 'sum' | 'min' | 'max' = 'mean',
  ) {
    if (nbSamples < 1) {
      // Throw error
      throw new BadRequestException('Invalid number of samples');
    }
    const tracer = trace.getTracer('telemetry-device');
    // Get the window time for 1 sample
    // Convert timespan to seconds
    // Convert timespan to seconds dynamically
    const timespanSeconds = parseTimespanToSeconds(timespan);
    // Calculate window duration in seconds
    const windowDurationSeconds = Math.ceil(timespanSeconds / nbSamples);

    // Prepare queries
    const metricsNoAgg = ['lock_state', 'location']; // metrics in which we are interested in the last values

    const fluxQueriesAgg = metricsAgg.map(
      (measurement) => `from(bucket: "telemetry") \
      |> range(start: ${timespan}) \
      |> filter(fn: (r) => r._measurement == "${measurement}") \
      |> filter(fn: (r) => r.device_id == "${id}")
      |> aggregateWindow(every: ${windowDurationSeconds}s, fn: ${aggFunc})
      |> filter(fn: (r) => exists r._value)
      |> limit(n: ${nbSamples})`,
    );
    const fluxQueriesNoAgg = metricsNoAgg.map(
      (measurement) => `from(bucket: "telemetry") \
      |> range(start: ${timespan}) \
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

  @Public()
  @Get('maps/locations')
  @ApiOperation({
    summary: 'Get latest location for all the devices',
  })
  @ApiResponse({
    status: 200,
    description:
      'Return the latest location results (latitude and longitude) for all devices during the last hour',
    type: [TelemetryEntryDto],
  })
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

  @Public()
  @Get(':id/maps/locations')
  @ApiOperation({
    summary:
      'Get all location measurements for a specific device in the last hour. Useful for route tracking.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Return the location results (latitude and longitude) for a specific device during the last hour.',
    type: [TelemetryEntryDto],
  })
  @ApiParam({
    name: 'id',
    description: 'Device ID (1, 2, 3 ...). Default: 1',
    required: false,
    type: Number,
    schema: { type: 'integer', default: 1 },
  })
  async getDeviceLocationHistory(@Param('id') id: number = 1) {
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
