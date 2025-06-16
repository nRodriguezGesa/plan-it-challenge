export class FileProcessingError extends Error {
  constructor(
    message: string,
    public readonly cause?: Error,
  ) {
    super(message);
    this.name = 'FileProcessingError';
  }
}

export class DatabaseError extends Error {
  constructor(
    message: string,
    public readonly cause?: Error,
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}
