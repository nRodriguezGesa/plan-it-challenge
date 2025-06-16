import { Injectable } from '@nestjs/common';
import { ClientProcessorService } from 'src/file-processor/clients/clientProcessor.service';
import { FileProcessorMetrics } from 'src/file-processor/baseFileProcessor';

@Injectable()
export class ClientService {
  constructor(private readonly clientProcessor: ClientProcessorService) {}

  async processClientBatchFromFile(
    filePath: string,
  ): Promise<FileProcessorMetrics> {
    return await this.clientProcessor.processFile(filePath);
  }
}
