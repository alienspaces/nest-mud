import { Module } from '@nestjs/common';
import { DataService } from './data.service';

// Application
import { LoggerModule } from '@/core';
import { RepositoriesModule } from '@/repositories';
import { DatabaseModule } from '@/core';
import { ServicesModule } from '@/services';

@Module({
    imports: [LoggerModule, DatabaseModule, RepositoriesModule, ServicesModule],
    exports: [DataService],
    providers: [DataService],
})
export class DataModule {}
