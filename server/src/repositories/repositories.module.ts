import { Module } from '@nestjs/common';

// Application
import { DatabaseModule, LoggerModule } from '@/core';
import { CharacterRepository } from './character/character.repository';
import { DungeonRepository } from './dungeon/dungeon.repository';
import { DungeonLocationRepository } from './dungeon_location/dungeon_location.repository';

@Module({
    imports: [LoggerModule, DatabaseModule],
    exports: [
        CharacterRepository,
        DungeonRepository,
        DungeonLocationRepository,
    ],
    providers: [
        CharacterRepository,
        DungeonRepository,
        DungeonLocationRepository,
    ],
})
export class RepositoriesModule {}
