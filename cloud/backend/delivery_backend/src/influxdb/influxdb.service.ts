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
