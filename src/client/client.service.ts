import { Injectable } from '@nestjs/common';
import { ClientProcessorService } from 'src/file-processor/clients/clientProcessor.service';
import { FileProcessorMetrics } from 'src/file-processor/fileProcessor';
import { ClientRepository } from './client.repository';

@Injectable()
export class ClientService {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly clientProcessor: ClientProcessorService,
  ) {}

  async processClientBatchFromFile(
    filePath: string,
  ): Promise<FileProcessorMetrics> {
    return await this.clientProcessor.processFile(filePath);
  }
}
