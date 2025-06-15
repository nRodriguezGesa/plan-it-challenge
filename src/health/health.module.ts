import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { TypedEnvConfig } from 'src/config/typed.env.config';

@Module({
  imports: [],
  controllers: [HealthController],
  providers: [HealthService, TypedEnvConfig],
})
export class HealthModule {}
