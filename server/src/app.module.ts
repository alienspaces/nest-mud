import { Module } from '@nestjs/common';

// Application
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './core/database/database.module';
import { RepositoriesModule } from './repositories';
import { LoggerModule } from './core/logger/logger.module';

import { DungeonLocationsController } from './controllers/dungeon_locations/locations.controller';
import { DungeonCharactersController } from './controllers/dungeon_characters/dungeon_characters.controller';
import { ActionsController } from './controllers/dungeon_character_actions/actions.controller';
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
        ActionsController,
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
