import { plainToInstance, Transform } from 'class-transformer';
import { IsNumber, IsString, validateSync } from 'class-validator';

export class EnvConfig {
  @Transform(({ value }) => parseInt(String(value)))
  @IsNumber()
  PORT: number;

  @IsString()
  BASE_PREFIX: string;

  @IsString()
  BASE_URL: string;

  @IsString()
  HOST: string;

  @Transform(({ value }) => parseInt(String(value)))
  @IsNumber()
  UNHEALTHY_MEMORY_USAGE_PERCENTAGE: number;

  @Transform(({ value }) => parseInt(String(value)))
  @IsNumber()
  UNHEALTHY_CPU_USAGE_PERCENTAGE: number;

  @Transform(({ value }) => parseInt(String(value)))
  @IsNumber()
  BATCH_SIZE: number;

  @IsString()
  CLIENT_FILE_SEPARATOR: string;

  @Transform(({ value }) => parseInt(String(value)))
  @IsNumber()
  CLIENT_FILE_MINUMUM_FIELDS: number;

  @IsString()
  DB_HOST: string;

  @Transform(({ value }) => parseInt(String(value)))
  @IsNumber()
  DB_PORT: number;

  @IsString()
  DB_USERNAME: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_DATABASE: string;

  @Transform(({ value }) => parseInt(String(value)))
  @IsNumber()
  MAX_FILE_SIZE_GB: number;

  @IsString()
  FILES_BASE_PATH: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvConfig, config);
  const errors = validateSync(validatedConfig);
  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}

export type EnvConfigType = EnvConfig;
