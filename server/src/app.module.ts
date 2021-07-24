import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Controllers
import { LocationsController } from './controllers/locations/locations.controller';
import { CharactersController } from './controllers/characters/characters.controller';
import { ActionsController } from './controllers/actions/actions.controller';

@Module({
  imports: [],
  controllers: [AppController, CharactersController, LocationsController, ActionsController],
  providers: [AppService],
})
export class AppModule {}
