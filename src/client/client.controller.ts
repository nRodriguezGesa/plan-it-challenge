import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { FileProcessorMetrics } from 'src/file-processor/baseFileProcessor';
import { FilePathValidationPipe } from 'src/utils/file.utils';
import {
  FileProcessingError,
  DatabaseError,
} from 'src/file-processor/fileProcessor.exceptions';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post('batch')
  async processFile(
    @Body('filePath', FilePathValidationPipe) filePath: string,
  ): Promise<FileProcessorMetrics> {
    if (!filePath) {
      throw new HttpException('File path is required', HttpStatus.BAD_REQUEST);
    }
    try {
      return await this.clientService.processClientBatchFromFile(filePath);
    } catch (error: unknown) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error instanceof FileProcessingError) {
        throw new HttpException(
          {
            message: 'File processing failed',
            details: error.message,
            timestamp: new Date().toISOString(),
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      if (error instanceof DatabaseError) {
        throw new HttpException(
          {
            message: 'Database operation failed',
            details: 'Please try again later',
          },
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
      throw new HttpException(
        {
          message: 'Internal server error',
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
