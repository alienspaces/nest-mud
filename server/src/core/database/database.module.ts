import { Module } from '@nestjs/common';

// Application
import { DatabaseService } from './database.service';

@Module({
    exports: [DatabaseModule],
    providers: [DatabaseService],
})
export class DatabaseModule {}
