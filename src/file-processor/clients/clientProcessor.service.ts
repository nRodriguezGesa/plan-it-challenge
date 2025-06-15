import { Injectable } from '@nestjs/common';
import { Client } from 'src/client/client';
import { BaseFileProcessor } from '../baseFileProcessor';
import { ClientProcessorStrategy } from './clientProcessorStrategy';

@Injectable()
export class ClientProcessorService extends BaseFileProcessor<Client> {
  constructor(clientProcessorStrategy: ClientProcessorStrategy) {
    super(clientProcessorStrategy);
  }
}
