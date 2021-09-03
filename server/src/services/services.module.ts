import { Module } from '@nestjs/common';

// Application
import { LoggerModule } from '@/core';
import { DungeonService } from './dungeon/dungeon.service';
import { DungeonLocationService } from './dungeon-location/dungeon-location.service';
import { DungeonCharacterService } from './dungeon-character/dungeon-character.service';
import { DungeonMonsterService } from './dungeon-monster/dungeon-monster.service';
import { DungeonObjectService } from './dungeon-object/dungeon-object.service';
import { DungeonActionService } from './dungeon-action/dungeon-action.service';
import { RepositoriesModule } from '@/repositories';

@Module({
    imports: [LoggerModule, RepositoriesModule],
    exports: [
        DungeonService,
        DungeonActionService,
        DungeonCharacterService,
        DungeonLocationService,
        DungeonMonsterService,
        DungeonObjectService,
    ],
    providers: [
        DungeonService,
        DungeonActionService,
        DungeonCharacterService,
        DungeonLocationService,
        DungeonMonsterService,
        DungeonObjectService,
    ],
})
export class ServicesModule {}
