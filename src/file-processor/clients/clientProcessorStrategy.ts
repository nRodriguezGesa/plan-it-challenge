import { Injectable, Logger } from '@nestjs/common';
import { TypedEnvConfig } from 'src/config/typed.env.config';
import { isValidEmail } from 'src/utils/string.utils';
import { FileProcessorStrategy } from '../IFileProcessStrategy';
import { Client } from 'src/client/client';
import { ClientRepository } from 'src/client/client.repository';

@Injectable()
export class ClientProcessorStrategy implements FileProcessorStrategy<Client> {
  private readonly logger = new Logger(ClientProcessorStrategy.name);
  private readonly batchSize: number;
  private readonly fieldSeparator: string;
  private readonly minimumFields: number;

  constructor(
    private readonly envConfig: TypedEnvConfig,
    private readonly clientRepository: ClientRepository,
  ) {
    this.batchSize = this.envConfig.config.BATCH_SIZE;
    this.fieldSeparator = this.envConfig.config.CLIENT_FILE_SEPARATOR;
    this.minimumFields = this.envConfig.config.CLIENT_FILE_MINUMUM_FIELDS;
  }

  parseLine(line: string): Client | null {
    try {
      const trimmedLine = line.trim();

      if (!trimmedLine) {
        return null;
      }

      const parts = trimmedLine.split(this.fieldSeparator);

      if (parts.length < this.minimumFields) {
        this.logger.warn(
          `Line has ${parts.length} fields, minimum required: ${this.minimumFields}. Line: ${line}`,
        );
        return null;
      }

      const [clientId, firstName, lastName, email, ageStr] = parts;

      if (!clientId?.trim() || !firstName?.trim() || !lastName?.trim()) {
        this.logger.warn(`Missing required fields in line: ${line}`);
        return null;
      }

      const trimmedClientId = clientId.trim();
      if (!this.isValidClientId(trimmedClientId)) {
        this.logger.warn(
          `Invalid client_id format '${trimmedClientId}'. Must be 6 digits. Line: ${line}`,
        );
        return null;
      }

      const cleanEmail = this.parseEmail(email);
      if (email && email.trim() && !cleanEmail) {
        this.logger.warn(`Invalid email format '${email}' in line: ${line}`);
      }

      const parsedAge = this.parseAge(ageStr);
      if (ageStr && ageStr.trim() && parsedAge === null) {
        this.logger.warn(`Invalid age '${ageStr}' in line: ${line}`);
      }

      return {
        clientId: trimmedClientId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: cleanEmail,
        age: parsedAge,
      };
    } catch (error) {
      this.logger.error(`Error parsing line: ${line}`, error);
      return null;
    }
  }

  private isValidClientId(clientId: string): boolean {
    const clientIdRegex = /^\d{6}$/;
    return clientIdRegex.test(clientId);
  }

  private parseEmail(email: string | undefined): string | undefined {
    if (!email || !email.trim()) {
      return undefined;
    }

    const trimmedEmail = email.trim();

    if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      return undefined;
    }

    return isValidEmail(trimmedEmail) ? trimmedEmail : undefined;
  }

  private parseAge(ageStr: string | undefined): number | undefined {
    if (!ageStr || !ageStr.trim()) {
      return undefined;
    }

    const parsed = parseInt(ageStr.trim());

    if (isNaN(parsed) || parsed < 0 || parsed > 150) {
      return undefined;
    }

    return parsed;
  }

  async processBatch(batch: Client[]): Promise<void> {
    this.logger.log(`Processing batch of ${batch.length} clients`);

    try {
      await this.clientRepository.batchInsert(batch);
      this.logger.log(`Successfully inserted ${batch.length} clients`);
    } catch (error) {
      this.logger.error(
        `Failed to insert batch of ${batch.length} clients:`,
        error,
      );
      throw error;
    }
  }

  validateData(data: Client): boolean {
    const isValid = !!(
      data.clientId &&
      data.firstName &&
      data.lastName &&
      this.isValidClientId(data.clientId)
    );

    if (!isValid) {
      this.logger.warn(`Data validation failed for: ${JSON.stringify(data)}`);
    }

    return isValid;
  }

  getFieldSeparator(): string {
    return this.fieldSeparator;
  }

  getMinimumFields(): number {
    return this.minimumFields;
  }

  getBatchSize(): number {
    return this.batchSize;
  }
}
