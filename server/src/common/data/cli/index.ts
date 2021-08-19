import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Application
import { DatabaseModule, LoggerModule, LoggerService } from '@/core';
import { RepositoriesModule } from '@/repositories';
import {
    Data,
    DataModule,
    DataService,
    defaultDataConfig,
} from '@/common/data';
import { ServicesModule } from '@/services';

@Module({
    imports: [
        ConfigModule.forRoot({ ignoreEnvFile: false }),
        LoggerModule,
        DatabaseModule,
        RepositoriesModule,
        ServicesModule,
        DataModule,
    ],
    providers: [LoggerService, DataService],
})
export class MainModule {}

class Main {
    async run() {
        const app = await NestFactory.create(MainModule);
        const loggerService = await app.resolve<LoggerService>(LoggerService);
        const dataService = await app.resolve<DataService>(DataService);

        const logger = loggerService.logger({ class: 'Main', function: 'run' });
        logger.info(`Have dataService ${dataService}`);
    }
}

new Main().run();
