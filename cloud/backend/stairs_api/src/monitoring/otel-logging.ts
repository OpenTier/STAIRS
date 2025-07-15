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

// src/otel.ts

import { credentials } from '@grpc/grpc-js';
import { resourceFromAttributes } from '@opentelemetry/resources';

import {
  LoggerProvider,
  BatchLogRecordProcessor,
} from '@opentelemetry/sdk-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-grpc';
import { logs } from '@opentelemetry/api-logs';

// 1) Build the Resource
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

// 4) **Batch** logs and register the processor
loggerProvider.addLogRecordProcessor(new BatchLogRecordProcessor(logExporter));

// 5) Hook it into the global API
logs.setGlobalLoggerProvider(loggerProvider);
