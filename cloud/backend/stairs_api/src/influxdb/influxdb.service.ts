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
