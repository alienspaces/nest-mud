import { Module } from '@nestjs/common';

// Application
import { DatabaseModule, LoggerModule } from '@/core';
import { DungeonRepository } from './dungeon/dungeon.repository';
import { DungeonLocationRepository } from './dungeon-location/dungeon-location.repository';
import { DungeonCharacterRepository } from './dungeon-character/dungeon-character.repository';
import { DungeonMonsterRepository } from './dungeon-monster/dungeon-monster.repository';
import { DungeonObjectRepository } from './dungeon-object/dungeon-object.repository';
import { DungeonActionRepository } from './dungeon-action/dungeon-action.repository';
import { DungeonActionCharacterRepository } from './dungeon-action-character/dungeon-action-character.repository';
import { DungeonActionMonsterRepository } from './dungeon-action-monster/dungeon-action-monster.repository';
import { DungeonActionObjectRepository } from './dungeon-action-object/dungeon-action-object.repository';

@Module({
    imports: [LoggerModule, DatabaseModule],
    exports: [
        DungeonRepository,
        DungeonLocationRepository,
        DungeonCharacterRepository,
        DungeonMonsterRepository,
        DungeonObjectRepository,
        DungeonActionRepository,
        DungeonActionCharacterRepository,
        DungeonActionMonsterRepository,
        DungeonActionObjectRepository,
    ],
    providers: [
        DungeonRepository,
        DungeonLocationRepository,
        DungeonCharacterRepository,
        DungeonMonsterRepository,
        DungeonObjectRepository,
        DungeonActionRepository,
        DungeonActionCharacterRepository,
        DungeonActionMonsterRepository,
        DungeonActionObjectRepository,
    ],
})
export class RepositoriesModule {}
