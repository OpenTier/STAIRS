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
    'service.name': 'stairs_api',
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
