import 'os';
import { NestFactory } from '@nestjs/core';
import { INestApplication, Module } from '@nestjs/common';
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
import { DataConfig } from '../data.config';

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
    loggerService: LoggerService;
    dataService: DataService;

    async run() {
        const app = await NestFactory.create(MainModule);
        this.loggerService = await app.resolve<LoggerService>(LoggerService);
        this.dataService = await app.resolve<DataService>(DataService);

        const logger = this.loggerService.logger({
            class: 'Main',
            function: 'run',
        });

        await this.loadData();
    }

    async loadData() {
        const logger = this.loggerService.logger({
            class: 'Main',
            function: 'loadData',
        });
        logger.info('Loading game data..');
        let config: DataConfig = require('./game.data.json');
        let data = new Data();
        await this.dataService.setup(config, data);
        logger.info('Done!');
    }

    usage() {
        console.log();
        console.log(`USAGE: db-seed load [filename]`);
        process.exit(1);
    }
}

new Main().run();
