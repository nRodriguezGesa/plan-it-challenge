import { Injectable, Logger } from '@nestjs/common';
import { Interface } from 'readline';
import { getLinesInterfaceFromFilePath } from 'src/utils/file.utils';
import {
  callGarbageCollector,
  getServerMemoryUsage,
} from 'src/utils/process.utils';
import { secondsBetweenDates } from 'src/utils/date.utilts';
import { MemoryHealth } from 'src/health/health';
import { FileProcessorStrategy } from './IFileProcessStrategy';
import { FileProcessingError } from './fileProcessor.exceptions';

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

@Injectable()
export abstract class BaseFileProcessor<T> {
  private metrics: FileProcessorMetrics = {
    errorLines: 0,
    processedLines: 0,
    totalLines: 0,
    startTime: new Date(),
    status: FileProcessorStatus.IDLE,
  };

  constructor(protected readonly strategy: FileProcessorStrategy<T>) {}

  async processFile(filePath: string): Promise<FileProcessorMetrics> {
    Logger.log(`Processing file: ${filePath}`);
    this.metrics = {
      errorLines: 0,
      processedLines: 0,
      totalLines: 0,
      startTime: new Date(),
      status: FileProcessorStatus.PROCESSING,
    };
    let currentBatch: T[] = [];
    let batchesProcessed = 0;
    const batchSize = this.strategy.getBatchSize();
    try {
      const rl: Interface = getLinesInterfaceFromFilePath(filePath);
      for await (const line of rl) {
        this.metrics.totalLines++;
        const parsedData = this.strategy.parseLine(line);
        if (parsedData && this.strategy.validateData(parsedData)) {
          currentBatch.push(parsedData);
          this.metrics.processedLines++;
        } else {
          this.metrics.errorLines++;
          Logger.warn(`Error parsing line ${this.metrics.totalLines}: ${line}`);
        }
        if (currentBatch.length >= batchSize) {
          await this.processBatch(currentBatch, ++batchesProcessed);
          currentBatch = [];
          this.optimizeMemory();
        }
        if (this.metrics.totalLines % 100 === 0) {
          this.logProgress();
        }
      }
      if (currentBatch.length > 0) {
        await this.processBatch(currentBatch, ++batchesProcessed);
        Logger.log(
          `Processed final batch ${batchesProcessed} with ${currentBatch.length} items`,
        );
      }
      this.metrics.status = FileProcessorStatus.COMPLETED;
      this.metrics.endTime = new Date();
      this.metrics.memoryUsage = `${getServerMemoryUsage().heapUsed}MB`;
      Logger.log(
        `File processing completed successfully. Processed ${batchesProcessed} batches.`,
      );
      this.logFinalStats();

      return this.metrics;
    } catch (error: unknown) {
      this.metrics.status = FileProcessorStatus.ERROR;
      this.metrics.endTime = new Date();
      const message =
        error instanceof Error ? error.message : 'Unknown processing error';
      Logger.error(`File processing failed: ${message}`, error);
      throw new FileProcessingError(
        `Failed to process file: ${filePath}`,
        error as Error,
      );
    }
  }

  private async processBatch(batch: T[], batchNumber: number): Promise<void> {
    const startTime = Date.now();
    try {
      await this.strategy.processBatch(batch);
      const duration = Date.now() - startTime;
      Logger.log(
        `Batch ${batchNumber} processed: ${batch.length} items in ${duration}ms`,
      );
    } catch (error) {
      Logger.error(
        `Error processing batch ${batchNumber} of ${batch.length} items: ${error}`,
      );
      throw error;
    }
  }

  private optimizeMemory(): void {
    callGarbageCollector();
    this.metrics.memoryUsage = `${getServerMemoryUsage().heapUsed}MB`;
  }

  getMetrics(): FileProcessorMetrics {
    return {
      ...this.metrics,
      memoryUsage: `${getServerMemoryUsage().heapUsed}MB`,
    };
  }

  isProcessing(): boolean {
    return this.metrics.status === FileProcessorStatus.PROCESSING;
  }

  getPerformanceStats(): {
    linesPerSecond: number;
    processingTimeMs: number;
    successRate: number;
  } {
    if (!this.metrics.endTime || !this.metrics.startTime) {
      return {
        linesPerSecond: 0,
        processingTimeMs: 0,
        successRate: 0,
      };
    }

    const processingTimeMs =
      this.metrics.endTime.getTime() - this.metrics.startTime.getTime();
    const linesPerSecond = Math.round(
      this.metrics.processedLines / (processingTimeMs / 1000),
    );
    const successRate =
      this.metrics.totalLines > 0
        ? Math.round(
            (this.metrics.processedLines / this.metrics.totalLines) * 100,
          )
        : 0;

    return {
      linesPerSecond,
      processingTimeMs,
      successRate,
    };
  }

  private logProgress(): void {
    const memory: MemoryHealth = getServerMemoryUsage();

    Logger.log(
      `Progress: ${this.metrics.processedLines}/${this.metrics.totalLines} lines processed, ` +
        `${this.metrics.errorLines} errors, ` +
        `Heap Usage: ${memory.heapUsed}MB`,
    );
  }

  private logFinalStats(): void {
    if (this.metrics.endTime) {
      const duration = secondsBetweenDates(
        this.metrics.startTime,
        this.metrics.endTime,
      );
      const linesPerSecond = Math.round(
        this.metrics.processedLines / (duration / 1000),
      );
      Logger.log(
        `Final Stats: ` +
          `${this.metrics.processedLines} lines processed, ` +
          `${this.metrics.errorLines} errors, ` +
          `Duration: ${duration}ms, ` +
          `Speed: ${linesPerSecond} lines/sec`,
      );
    }
    Logger.log('Finished File Processing');
  }
}
