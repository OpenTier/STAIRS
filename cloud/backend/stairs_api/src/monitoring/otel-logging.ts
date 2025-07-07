// src/otel.ts

import { credentials } from '@grpc/grpc-js';
import { resourceFromAttributes } from '@opentelemetry/resources';

import {
  LoggerProvider,
  BatchLogRecordProcessor,
} from '@opentelemetry/sdk-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-grpc';
import { logs } from '@opentelemetry/api-logs';

// 1) Build your Resource
const resource = resourceFromAttributes({
  'service.name': 'stairs_api',
  'service.instance.id': 'instance-1',
});

// 2) Create & wire up the LoggerProvider
const loggerProvider = new LoggerProvider({ resource });

// 3) Create the gRPC OTLP exporter (insecure = true)
const logExporter = new OTLPLogExporter({
  credentials: credentials.createInsecure(),
});

// 4) **Batch** your logs and register the processor
loggerProvider.addLogRecordProcessor(new BatchLogRecordProcessor(logExporter)); // <–– JS SDK still uses addLogRecordProcessor + BatchLogRecordProcessor :contentReference[oaicite:0]{index=0}

// 5) Hook it into the global API
logs.setGlobalLoggerProvider(loggerProvider);
