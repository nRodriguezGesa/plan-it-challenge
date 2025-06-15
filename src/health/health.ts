import { OmitType } from '@nestjs/swagger';

export enum HealthStatus {
  HEALTHY = 'healthy',
  UNHEALTHY = 'unhealthy',
}

export enum DataBaseStatus {
  UP = 'up',
  DOWN = 'down',
}

export type DatabaseHealth = {
  status: DataBaseStatus;
  responseTime: number;
};

export type MemoryHealth = {
  heapUsed: number;
  heapTotal: number;
  usage: number;
  processMemoryMB: number;
  totalSystemMemory: number;
  freeSystemMemory: number;
  usedSystemMemory: number;
  processRealMemory: number;
  systemUsage: number;
  heapUsage: number;
};

export type MemoryHealthResponse = {
  heapUsed: string;
  heapTotal: string;
  usage: string;
  processMemoryMB: string;
  totalSystemMemory: string;
  freeSystemMemory: string;
  usedSystemMemory: string;
  processRealMemory: string;
  systemUsage: string;
  heapUsage: string;
};

export type ProcessingHealth = {
  isProcessing: boolean;
  activeProcesses: number;
};

export class Health {
  status: HealthStatus;
  timestamp: Date;
  uptime: number;
  databaseHealth: DatabaseHealth;
  memoryHealth: MemoryHealth;
  processing: ProcessingHealth;
  cpuUsage: number;
}

export class HealthResponse extends OmitType(Health, [
  'memoryHealth',
  'cpuUsage',
  'uptime',
] as const) {
  memoryHealth: MemoryHealthResponse;
  cpuUsage: string;
  uptime: string;
}
