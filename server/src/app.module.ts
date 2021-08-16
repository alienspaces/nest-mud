import { Module } from '@nestjs/common';

// Application
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './core/database/database.module';
import { RepositoriesModule } from './repositories';
import { LoggerModule } from './core/logger/logger.module';

import { DungeonLocationsController } from './controllers/dungeon-location/dungeon-location.controller';
import { DungeonCharactersController } from './controllers/dungeon-character/dungeon-character.controller';
import { DungeonCharacterActionController } from './controllers/dungeon-character-action/dungeon-character-action.controller';
import {
    ServicesModule,
    ActionService,
    DungeonService,
    DungeonLocationService,
    DungeonCharacterService,
} from '@/services';

@Module({
    imports: [DatabaseModule, RepositoriesModule, LoggerModule, ServicesModule],
    controllers: [
        AppController,
        DungeonCharactersController,
        DungeonLocationsController,
        DungeonCharacterActionController,
    ],
    providers: [
        AppService,
        DungeonService,
        DungeonLocationService,
        DungeonCharacterService,
        ActionService,
    ],
})
export class AppModule {}
