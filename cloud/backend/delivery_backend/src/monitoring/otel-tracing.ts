// src/otel-tracing.ts
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { credentials } from '@grpc/grpc-js';

/* By default the auto-instrumentations will pick up:
1. HTTP requests (@opentelemetry/instrumentation-http)
2. Express/Nest.js framework calls
3. Popular DB clients, gRPC, etc.
*/

export function setupTracing() {
  if (process.env.ENABLE_TRACING !== 'true') {
    console.log('[otel] Tracing disabled');
    return;
  }

  // See https://opentelemetry.io/docs/languages/js/getting-started/nodejs/
  const resource = resourceFromAttributes({
    'service.name': 'delivery_backend',
    'service.instance.id': 'instance-1',
  });

  const traceExporter = new OTLPTraceExporter({
    credentials: credentials.createInsecure(),
  });

  const sdk = new NodeSDK({
    resource: resource,
    traceExporter,
    instrumentations: [getNodeAutoInstrumentations()],
  });

  sdk.start();
}
