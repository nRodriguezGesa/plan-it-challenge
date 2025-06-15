import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvConfigType } from './env.config';

@Injectable()
export class TypedEnvConfig {
  constructor(private configService: ConfigService<EnvConfigType>) {}

  get config(): EnvConfigType {
    return {
      PORT: this.configService.get('PORT', { infer: true }),
      BASE_PREFIX: this.configService.get('BASE_PREFIX', { infer: true }),
      BASE_URL: this.configService.get('BASE_URL', { infer: true }),
      HOST: this.configService.get('HOST', { infer: true }),

      UNHEALTHY_MEMORY_USAGE_PERCENTAGE: this.configService.get(
        'UNHEALTHY_MEMORY_USAGE_PERCENTAGE',
        { infer: true },
      ),
      UNHEALTHY_CPU_USAGE_PERCENTAGE: this.configService.get(
        'UNHEALTHY_CPU_USAGE_PERCENTAGE',
        { infer: true },
      ),

      BATCH_SIZE: this.configService.get('BATCH_SIZE', { infer: true }),
      CLIENT_FILE_SEPARATOR: this.configService.get('CLIENT_FILE_SEPARATOR', {
        infer: true,
      }),
      CLIENT_FILE_MINUMUM_FIELDS: this.configService.get(
        'CLIENT_FILE_MINUMUM_FIELDS',
        { infer: true },
      ),
      MAX_FILE_SIZE: this.configService.get('MAX_FILE_SIZE', { infer: true }),

      DB_HOST: this.configService.get('DB_HOST', { infer: true }),
      DB_PORT: this.configService.get('DB_PORT', { infer: true }),
      DB_USERNAME: this.configService.get('DB_USERNAME', { infer: true }),
      DB_PASSWORD: this.configService.get('DB_PASSWORD', { infer: true }),
      DB_DATABASE: this.configService.get('DB_DATABASE', { infer: true }),
    } as EnvConfigType;
  }

  get databaseConfig() {
    return {
      type: 'mssql' as const,
      host: this.config.DB_HOST,
      port: this.config.DB_PORT,
      username: this.config.DB_USERNAME,
      password: this.config.DB_PASSWORD,
      database: this.config.DB_DATABASE,
    };
  }

  get fileProcessingConfig() {
    return {
      batchSize: this.config.BATCH_SIZE,
      separator: this.config.CLIENT_FILE_SEPARATOR,
      minimumFields: this.config.CLIENT_FILE_MINUMUM_FIELDS,
      maxFileSize: this.config.MAX_FILE_SIZE,
    };
  }
}
