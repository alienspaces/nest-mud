import { Module } from '@nestjs/common';

// Application
import { LoggerModule } from '@/core';
import { DungeonService } from './dungeon/dungeon.service';
import { DungeonLocationService } from './dungeon/dungeon-location.service';
import { DungeonCharacterService } from './dungeon/dungeon-character.service';
import { RepositoriesModule } from '@/repositories';

@Module({
    imports: [LoggerModule, RepositoriesModule],
    exports: [DungeonService, DungeonLocationService, DungeonCharacterService],
    providers: [
        DungeonService,
        DungeonLocationService,
        DungeonCharacterService,
    ],
})
export class ServicesModule {}
