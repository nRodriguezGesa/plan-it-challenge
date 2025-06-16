import { Injectable } from '@nestjs/common';
import {
  HealthResponse,
  HealthStatus,
  MemoryHealth,
  MemoryHealthResponse,
  ProcessingHealth,
} from './health';
import {
  getServerCPUUsage,
  getServerMemoryUsage,
  getServerUpTime,
} from 'src/utils/process.utils';
import { TypedEnvConfig } from 'src/config/typed.env.config';
import { ClientProcessorService } from 'src/file-processor/clients/clientProcessor.service';

@Injectable()
export class HealthService {
  constructor(
    private readonly envConfig: TypedEnvConfig,
    private readonly clientProcessor: ClientProcessorService,
  ) {}

  async getHealth(): Promise<HealthResponse> {
    const cpuUsage = await getServerCPUUsage();
    const memoryUsage = getServerMemoryUsage();
    const memoryUsageResponse: MemoryHealthResponse = {
      heapUsed: `${memoryUsage.heapUsed}MB`,
      heapTotal: `${memoryUsage.heapTotal}MB`,
      usage: `${memoryUsage.usage}%`,
      processMemoryMB: `${memoryUsage.processMemoryMB}MB`,
      totalSystemMemory: `${memoryUsage.totalSystemMemory}MB`,
      freeSystemMemory: `${memoryUsage.freeSystemMemory}MB`,
      usedSystemMemory: `${memoryUsage.usedSystemMemory}MB`,
      processRealMemory: `${memoryUsage.processRealMemory}MB`,
      systemUsage: `${memoryUsage.systemUsage}%`,
      heapUsage: `${memoryUsage.heapUsage}%`,
    };
    const status = this.isServerHealthy(memoryUsage, cpuUsage)
      ? HealthStatus.HEALTHY
      : HealthStatus.UNHEALTHY;
    const processingHealth: ProcessingHealth = {
      isProcessing: this.clientProcessor.isProcessing(),
    };
    return {
      status,
      uptime: `${getServerUpTime()}s`,
      cpuUsage: `${cpuUsage}%`,
      memoryHealth: memoryUsageResponse,
      processing: processingHealth,
      timestamp: new Date(),
    } as HealthResponse;
  }

  private isServerHealthy(
    memoryHealth: MemoryHealth,
    cpuUsage: number,
  ): boolean {
    return (
      cpuUsage < this.envConfig.config.UNHEALTHY_CPU_USAGE_PERCENTAGE &&
      memoryHealth.usage <
        this.envConfig.config.UNHEALTHY_MEMORY_USAGE_PERCENTAGE &&
      memoryHealth.systemUsage <
        this.envConfig.config.UNHEALTHY_MEMORY_USAGE_PERCENTAGE
    );
  }
}
