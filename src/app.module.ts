import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { validateEnv, EnvConfigType } from './config/env.config';
import { TypedEnvConfig } from './config/typed.env.config';
import { HealthModule } from './health/health.module';
import { ClientModule } from './client/client.module';
import { ClientEntity } from './client/client.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: validateEnv,
      envFilePath: ['.env'],
      isGlobal: true,
      expandVariables: true,
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvConfigType>) => ({
        type: 'mssql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [ClientEntity],
        synchronize: false,
        options: {
          encrypt: false,
          trustServerCertificate: true,
        },
        logging: process.env.NODE_ENV === 'development',
      }),
    }),
    HealthModule,
    ClientModule,
  ],
  controllers: [],
  providers: [TypedEnvConfig],
})
export class AppModule {}
