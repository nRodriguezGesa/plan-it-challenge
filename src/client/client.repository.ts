import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientEntity } from './client.entity';
import { Client } from './client';

@Injectable()
export class ClientRepository {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly repository: Repository<ClientEntity>,
  ) {}

  async batchInsert(clients: Client[]): Promise<void> {
    const startTime = Date.now();
    try {
      const clientEntities: ClientEntity[] = clients.map((client) =>
        ClientEntity.fromClientData(client),
      );
      await this.repository
        .createQueryBuilder()
        .insert()
        .into(ClientEntity)
        .values(clientEntities)
        .orIgnore()
        .execute();
      const duration = Date.now() - startTime;
      Logger.log(
        `Inserted ${clients.length} clients in ${duration} milliseconds`,
      );
    } catch (error) {
      Logger.error(`Error inserting clients: ${error}`);
      throw error;
    }
  }
}
