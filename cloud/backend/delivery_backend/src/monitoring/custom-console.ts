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
