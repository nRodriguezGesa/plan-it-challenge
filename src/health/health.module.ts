import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { TypedEnvConfig } from 'src/config/typed.env.config';
import { ClientModule } from 'src/client/client.module';

@Module({
  imports: [ClientModule],
  controllers: [HealthController],
  providers: [HealthService, TypedEnvConfig],
})
export class HealthModule {}
