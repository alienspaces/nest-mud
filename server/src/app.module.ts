import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Controllers
import { DatabaseModule } from './core/database/database.module';
import { RepositoriesModule } from './repositories';
import { LoggerModule } from './core/logger/logger.module';
import { LocationsController } from './controllers/locations/locations.controller';
import { CharactersController } from './controllers/characters/characters.controller';
import { ActionsController } from './controllers/actions/actions.controller';
import {
    ServicesModule,
    ActionService,
    DungeonService,
    CharacterService,
} from '@/services';

@Module({
    imports: [DatabaseModule, RepositoriesModule, LoggerModule, ServicesModule],
    controllers: [
        AppController,
        CharactersController,
        LocationsController,
        ActionsController,
    ],
    providers: [AppService, DungeonService, CharacterService, ActionService],
})
export class AppModule {}
