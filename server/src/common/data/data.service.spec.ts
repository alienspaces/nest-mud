import { Test, TestingModule } from '@nestjs/testing';
import { ContextIdFactory } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

// Application
import {
    DatabaseModule,
    DatabaseService,
    LoggerModule,
    LoggerService,
} from '@/core';
import { RepositoriesModule } from '@/repositories';
import {
    CharacterService,
    CreateCharacterEntity,
    CharacterEntity,
    LocationService,
    CreateLocationEntity,
    LocationEntity,
    ServicesModule,
} from '@/services';

import { DataService } from './data.service';
import { defaultDataConfig } from './data.config';
import { database } from 'faker';

describe('DataService', () => {
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ ignoreEnvFile: false }),
                LoggerModule,
                DatabaseModule,
                RepositoriesModule,
                ServicesModule,
            ],
            providers: [
                LoggerService,
                DatabaseService,
                LocationService,
                CharacterService,
                DataService,
            ],
        }).compile();
    });

    it('should be defined', async () => {
        const service = await module.resolve<DataService>(
            DataService,
            // contextId
        );
        expect(service).toBeDefined();
    });

    it('should be create default data', async () => {
        const service = await module.resolve<DataService>(DataService);
        await service.setup(defaultDataConfig);
        expect(service.locationEntities).toBeTruthy();
        expect(service.characterEntities).toBeTruthy();
        await service.teardown();
    });
});
