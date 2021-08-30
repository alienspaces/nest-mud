import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

// Application
import { DatabaseModule } from './core/database/database.module';
import { RepositoriesModule } from './repositories';
import { LoggerModule } from './core/logger/logger.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DungeonController } from './controllers/dungeon/dungeon.controller';
import { DungeonLocationsController } from './controllers/dungeon-location/dungeon-location.controller';
import { DungeonCharactersController } from './controllers/dungeon-character/dungeon-character.controller';
import { DungeonCharacterActionController } from './controllers/dungeon-action/dungeon-character-action.controller';
import { TransactionInterceptor } from './interceptors/transaction/transaction.interceptor';
import {
    ServicesModule,
    DungeonService,
    DungeonLocationService,
    DungeonCharacterService,
    DungeonActionService,
} from '@/services';
import { InterceptorsModule } from './interceptors';

@Module({
    imports: [
        ConfigModule.forRoot({ ignoreEnvFile: false }),
        DatabaseModule,
        RepositoriesModule,
        LoggerModule,
        ServicesModule,
        InterceptorsModule,
    ],
    controllers: [
        AppController,
        DungeonController,
        DungeonCharactersController,
        DungeonLocationsController,
        DungeonCharacterActionController,
    ],
    providers: [
        AppService,
        DungeonService,
        DungeonLocationService,
        DungeonCharacterService,
        DungeonActionService,
        {
            provide: APP_INTERCEPTOR,
            useClass: TransactionInterceptor,
        },
    ],
})
export class AppModule {}
