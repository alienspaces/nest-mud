import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Controller } from './controllers/characters/.controller';
import { LocationsController } from './controllers/locations/locations/locations.controller';
import { LocationsController } from './controllers/locations/locations.controller';
import { ActionsController } from './controllers/actions/actions.controller';

@Module({
  imports: [],
  controllers: [AppController, Controller, LocationsController, ActionsController],
  providers: [AppService],
})
export class AppModule {}
