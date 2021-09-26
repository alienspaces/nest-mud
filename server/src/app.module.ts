import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Application
import { DatabaseModule } from './core/database/database.module';
import { RepositoriesModule } from './repositories';
import { LoggerModule } from './core/logger/logger.module';
import { CustomExceptionFilterModule } from './filters';
import { InterceptorsModule } from './interceptors';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DungeonController } from './controllers/dungeon/dungeon.controller';
import { DungeonLocationsController } from './controllers/dungeon-location/dungeon-location.controller';
import { DungeonCharactersController } from './controllers/dungeon-character/dungeon-character.controller';
import { DungeonCharacterActionController } from './controllers/dungeon-action/dungeon-character-action.controller';
import {
    ServicesModule,
    DungeonService,
    DungeonLocationService,
    DungeonCharacterService,
    DungeonActionService,
} from '@/services';

@Module({
    imports: [
        ConfigModule.forRoot({ ignoreEnvFile: false }),
        DatabaseModule,
        RepositoriesModule,
        LoggerModule,
        ServicesModule,
        InterceptorsModule,
        CustomExceptionFilterModule,
    ],
    controllers: [
        AppController,
        DungeonController,
        DungeonCharactersController,
        DungeonLocationsController,
        DungeonCharacterActionController,
    ],
    providers: [AppService, DungeonService, DungeonLocationService, DungeonCharacterService, DungeonActionService],
})
export class AppModule {}
