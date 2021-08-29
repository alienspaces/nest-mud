import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Application
import { LoggerModule } from '@/core/logger/logger.module';
import { DatabaseService } from './database.service';

@Module({
    imports: [ConfigModule.forRoot({ ignoreEnvFile: false }), LoggerModule],
    exports: [DatabaseService],
    providers: [DatabaseService],
})
export class DatabaseModule {}
