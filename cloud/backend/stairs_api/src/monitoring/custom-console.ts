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
