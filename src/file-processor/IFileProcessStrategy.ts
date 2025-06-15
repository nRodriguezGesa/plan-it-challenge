export interface FileProcessorStrategy<T> {
  parseLine(line: string): T | null;
  processBatch(batch: T[]): Promise<void>;
  getFieldSeparator(): string;
  getMinimumFields(): number;
  getBatchSize(): number;
  validateData(data: T): boolean;
}
