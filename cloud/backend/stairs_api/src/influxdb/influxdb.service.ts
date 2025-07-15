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

import { Injectable, Inject } from '@nestjs/common';
import { InfluxDB, WriteApi, QueryApi } from '@influxdata/influxdb-client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InfluxDbService {
  private client: InfluxDB;
  private writeApi: WriteApi;
  private queryApi: QueryApi;

  constructor(@Inject(ConfigService) private configService: ConfigService) {
    const url = this.configService.get<string>('INFLUXDB_HOST');
    const token = this.configService.get<string>('INFLUXDB_TOKEN');
    const org = this.configService.get<string>('INFLUXDB_ORG');
    const bucket = this.configService.get<string>('INFLUXDB_BUCKET');

    this.client = new InfluxDB({ url, token });
    this.writeApi = this.client.getWriteApi(org, bucket);
    this.queryApi = this.client.getQueryApi(org);
  }

  async writeData(data: any): Promise<void> {
    try {
      this.writeApi.writePoints(data);
      await this.writeApi.flush();
    } catch (error) {
      console.error('Error writing data to InfluxDB:', error);
    }
  }

  async queryData(fluxQuery: string): Promise<any> {
    try {
      return await this.queryApi.collectRows(fluxQuery);
    } catch (error) {
      console.error('Error querying data from InfluxDB:', error);
      throw error;
    }
  }
}
