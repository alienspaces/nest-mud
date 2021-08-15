import { Module } from '@nestjs/common';

// Application
import { DatabaseModule, LoggerModule } from '@/core';
import { DungeonRepository } from './dungeon/dungeon.repository';
import { DungeonLocationRepository } from './dungeon_location/dungeon_location.repository';
import { DungeonCharacterRepository } from './dungeon_character/dungeon_character.repository';

@Module({
    imports: [LoggerModule, DatabaseModule],
    exports: [
        DungeonRepository,
        DungeonLocationRepository,
        DungeonCharacterRepository,
    ],
    providers: [
        DungeonRepository,
        DungeonLocationRepository,
        DungeonCharacterRepository,
    ],
})
export class RepositoriesModule {}
