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
import { LocationService } from './services/location/location.service';
import { ActionService } from './services/action/action.service';
import { CharacterService } from './services/character/character.service';

@Module({
    imports: [DatabaseModule, RepositoriesModule, LoggerModule],
    controllers: [
        AppController,
        CharactersController,
        LocationsController,
        ActionsController,
    ],
    providers: [AppService, LocationService, CharacterService, ActionService],
})
export class AppModule {}
