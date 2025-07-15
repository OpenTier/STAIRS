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

// custom-console.ts
import { logs, SeverityNumber } from '@opentelemetry/api-logs';

export function setupConsoleLogInterceptor() {
  const logger = logs.getLogger('nestjs-console');

  const format = (args: unknown[]) =>
    args
      .map((arg) => (typeof arg === 'string' ? arg : JSON.stringify(arg)))
      .join(' ');

  const levelMap: Record<
    'debug' | 'log' | 'info' | 'warn' | 'error',
    { severityNumber: SeverityNumber; severityText: string }
  > = {
    debug: { severityNumber: SeverityNumber.DEBUG, severityText: 'DEBUG' },
    log: { severityNumber: SeverityNumber.INFO, severityText: 'INFO' },
    info: { severityNumber: SeverityNumber.INFO, severityText: 'INFO' },
    warn: { severityNumber: SeverityNumber.WARN, severityText: 'WARN' },
    error: { severityNumber: SeverityNumber.ERROR, severityText: 'ERROR' },
  };

  (['debug', 'log', 'info', 'warn', 'error'] as const).forEach((level) => {
    const original = console[level] as (...args: any[]) => void;

    console[level] = (...args: any[]) => {
      const { severityNumber, severityText } = levelMap[level];

      logger.emit({
        body: format(args),
        severityNumber,
        severityText,
      });

      original.apply(console, args);
    };
  });
}
