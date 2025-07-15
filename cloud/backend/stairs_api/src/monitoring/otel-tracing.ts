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
