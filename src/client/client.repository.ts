import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientEntity } from './client.entity';
import { Client } from './client';
import { DatabaseError } from 'src/file-processor/fileProcessor.exceptions';

@Injectable()
export class ClientRepository {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly repository: Repository<ClientEntity>,
  ) {}

  async batchInsert(clients: Client[]): Promise<void> {
    try {
      const clientEntities = clients.map((client) =>
        ClientEntity.fromClientData(client),
      );
      await this.repository
        .createQueryBuilder()
        .insert()
        .into(ClientEntity)
        .values(clientEntities)
        .orIgnore()
        .execute();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown database error';
      Logger.error(`Database insert failed: ${message}`, error);
      throw new DatabaseError(
        `Failed to insert ${clients.length} clients`,
        error as Error,
      );
    }
  }
}
