import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
} from 'typeorm';
import { Client } from './client';

@Entity('client')
export class ClientEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'client_id',
    type: 'varchar',
    length: 10,
    nullable: false,
    unique: true,
  })
  @Index({ unique: true })
  clientId: string;

  @Column({ name: 'first_name', type: 'varchar', length: 100, nullable: false })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100, nullable: false })
  lastName: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  @Index()
  email?: string;

  @Column({ name: 'age', type: 'int', nullable: true })
  age?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  //Posiblemente agregar batchId y una nueva entidad que maneja cada vez que se carga informacion

  static fromClientData(data: Client): ClientEntity {
    const entity = new ClientEntity();
    entity.clientId = data.clientId;
    entity.firstName = data.firstName;
    entity.lastName = data.lastName;
    entity.email = data.email;
    entity.age = data.age;
    return entity;
  }
}
