import { Module } from '@nestjs/common';
import { DataService } from './data/data.service';

@Module({
    exports: [DataService],
    providers: [DataService],
})
export class CommonModule {}
