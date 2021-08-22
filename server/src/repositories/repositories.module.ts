import { Module } from '@nestjs/common';

// Application
import { DatabaseModule, LoggerModule } from '@/core';
import { DungeonRepository } from './dungeon/dungeon.repository';
import { DungeonLocationRepository } from './dungeon-location/dungeon-location.repository';
import { DungeonCharacterRepository } from './dungeon-character/dungeon-character.repository';
import { DungeonMonsterRepository } from './dungeon-monster/dungeon-monster.repository';
import { DungeonObjectRepository } from './dungeon-object/dungeon-object.repository';
import { DungeonCharacterActionRepository } from './dungeon-character-action/dungeon-character-action.repository';

@Module({
    imports: [LoggerModule, DatabaseModule],
    exports: [
        DungeonRepository,
        DungeonLocationRepository,
        DungeonCharacterRepository,
        DungeonMonsterRepository,
        DungeonObjectRepository,
        DungeonCharacterActionRepository,
    ],
    providers: [
        DungeonRepository,
        DungeonLocationRepository,
        DungeonCharacterRepository,
        DungeonMonsterRepository,
        DungeonObjectRepository,
        DungeonCharacterActionRepository,
    ],
})
export class RepositoriesModule {}
