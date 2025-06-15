import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { FileProcessorMetrics } from 'src/file-processor/fileProcessor';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post('batch')
  async processFile(
    @Body('filePath') filePath: string,
  ): Promise<FileProcessorMetrics> {
    if (!filePath) {
      throw new HttpException('File path is required', HttpStatus.BAD_REQUEST);
    }
    try {
      return await this.clientService.processClientBatchFromFile(filePath);
    } catch (error) {
      throw new HttpException(
        `Error processing file: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
