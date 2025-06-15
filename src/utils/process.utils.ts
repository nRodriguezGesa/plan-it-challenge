import { MemoryHealth } from 'src/health/health';
import { bytesToMB } from './dataUnits.utils';
import * as si from 'systeminformation';
import * as os from 'os';

export function getServerUpTime(): number {
  return Number(process.uptime().toFixed(2));
}
export function getServerMemoryUsage(): MemoryHealth {
  const processMemory = process.memoryUsage();
  const totalSystemMemory = os.totalmem();
  const freeSystemMemory = os.freemem();
  const usedSystemMemory = totalSystemMemory - freeSystemMemory;
  const processRealMemory = processMemory.rss;
  return {
    heapUsed: bytesToMB(processMemory.heapUsed),
    heapTotal: bytesToMB(processMemory.heapTotal),
    processMemoryMB: bytesToMB(processRealMemory),
    systemTotalMB: bytesToMB(totalSystemMemory),
    systemUsedMB: bytesToMB(usedSystemMemory),
    usage: Math.round((processRealMemory / totalSystemMemory) * 100),
    systemUsage: Math.round((usedSystemMemory / totalSystemMemory) * 100),
    freeSystemMemory,
    processRealMemory,
    totalSystemMemory,
    usedSystemMemory,
    heapUsage: Math.round(
      (processMemory.heapUsed / processMemory.heapTotal) * 100,
    ),
  } as MemoryHealth;
}

export async function getServerCPUUsage(): Promise<number> {
  const processes = await si.processes();
  const currentProcess = processes.list.find((p) => p.pid === process.pid);
  return currentProcess ? currentProcess.cpu : 0;
}

export function callGarbageCollector(): void {
  if (global.gc) {
    global.gc();
  }
}
