import { Logger } from '@nestjs/common';
import { MemoryHealth } from 'src/health/health';
import { secondsBetweenDates } from 'src/utils/date.utilts';
import { getServerMemoryUsage } from 'src/utils/process.utils';

export enum FileProcessorStatus {
  IDLE = 'idle',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  ERROR = 'error',
}

export enum FileProcessorType {
  CLIENT = 'client',
}

export interface FileProcessorMetrics {
  totalLines: number;
  processedLines: number;
  errorLines: number;
  startTime: Date;
  endTime?: Date;
  status: FileProcessorStatus;
  memoryUsage?: string;
}

export function logFileProcessorProgress(metrics: FileProcessorMetrics): void {
  const memory: MemoryHealth = getServerMemoryUsage();

  Logger.log(
    `Progress: ${metrics.processedLines}/${metrics.totalLines} lines processed, ` +
      `${metrics.errorLines} errors, ` +
      `Heap Usage: ${memory.heapUsed}MB`,
  );
}

export function logFileProcessorFinalStats(
  metrics: FileProcessorMetrics,
): void {
  if (metrics.endTime) {
    const duration = secondsBetweenDates(metrics.startTime, metrics.endTime);
    const linesPerSecond = Math.round(
      metrics.processedLines / (duration / 1000),
    );
    Logger.log(
      `Final Stats: ` +
        `${metrics.processedLines} lines processed, ` +
        `${metrics.errorLines} errors, ` +
        `Duration: ${duration}ms, ` +
        `Speed: ${linesPerSecond} lines/sec`,
    );
  }
  Logger.log('Finished File Processing');
}

export function processFile(filePath: string): FileProcessorMetrics {
  Logger.log(`Processing file: ${filePath}`);
  const metrics: FileProcessorMetrics = {
    totalLines: 0,
    processedLines: 0,
    errorLines: 0,
    startTime: new Date(),
    status: FileProcessorStatus.PROCESSING,
  };
  return metrics;
}
