import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Controllers
import { LocationsController } from './controllers/locations/locations.controller';
import { CharactersController } from './controllers/characters/characters.controller';
import { ActionsController } from './controllers/actions/actions.controller';
import { LocationsService } from './services/locations/locations.service';
import { ActionsService } from './services/actions/actions.service';
import { CharactersService } from './services/characters/characters.service';
// import { LocationService } from './repositories/location/location.service';
// import { CharacterService } from './repositories/character/character.service';
import { DatabaseService } from './core/database/database.service';
import { LoggerModule } from './core/logger/logger.module';

@Module({
    imports: [],
    controllers: [
        AppController,
        CharactersController,
        LocationsController,
        ActionsController,
    ],
    providers: [
        AppService,
        LocationsService,
        CharactersService,
        ActionsService,
        DatabaseService,
        LoggerModule,
    ],
})
export class AppModule {}
