import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEntity } from './client.entity';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { ClientRepository } from './client.repository';
import { ClientProcessorService } from '../file-processor/clients/clientProcessor.service';
import { ClientProcessorStrategy } from '../file-processor/clients/clientProcessorStrategy';
import { TypedEnvConfig } from 'src/config/typed.env.config';

@Module({
  imports: [TypeOrmModule.forFeature([ClientEntity])],
  controllers: [ClientController],
  providers: [
    ClientService,
    ClientRepository,
    ClientProcessorStrategy,
    ClientProcessorService,
    TypedEnvConfig,
  ],
  exports: [ClientService, ClientProcessorService],
})
export class ClientModule {}
