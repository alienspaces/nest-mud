import { Module } from '@nestjs/common';

// Application
import { LoggerModule } from '@/core';
import { DungeonService } from './dungeon/dungeon.service';
import { DungeonLocationService } from './dungeon-location/dungeon-location.service';
import { DungeonCharacterService } from './dungeon-character/dungeon-character.service';
import { DungeonActionService } from './dungeon-action/dungeon-action.service';
import { RepositoriesModule } from '@/repositories';

@Module({
    imports: [LoggerModule, RepositoriesModule],
    exports: [
        DungeonService,
        DungeonLocationService,
        DungeonCharacterService,
        DungeonActionService,
    ],
    providers: [
        DungeonService,
        DungeonLocationService,
        DungeonCharacterService,
        DungeonActionService,
    ],
})
export class ServicesModule {}
