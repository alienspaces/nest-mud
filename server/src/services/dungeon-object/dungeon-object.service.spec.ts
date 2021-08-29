import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { ContextIdFactory } from '@nestjs/core';
import * as crypto from 'crypto';

// Application
import { DatabaseModule, LoggerModule, LoggerService } from '@/core';
import { RepositoriesModule } from '@/repositories';
import { Data, DataModule, DataService, defaultDataConfig } from '@/common/data';
import { ServicesModule } from '@/services/services.module';
import { DungeonObjectService } from './dungeon-object.service';

describe('DungeonObjectService', () => {
    let module: TestingModule;
    let service: DungeonObjectService;
    let dataService: DataService;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ ignoreEnvFile: false }),
                DatabaseModule,
                LoggerModule,
                ServicesModule,
                RepositoriesModule,
                DataModule,
            ],
        }).compile();
    });

    beforeAll(async () => {
        const contextId = ContextIdFactory.create();
        dataService = await module.resolve<DataService>(DataService, contextId);
        service = await module.resolve<DungeonObjectService>(DungeonObjectService, contextId);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getDungeonObject', () => {
        it('should return a DungeonObjectEntity with a valid identifier', async () => {
            const data = new Data();
            await expect(dataService.setup(defaultDataConfig(), data)).resolves.not.toThrow();

            const entity = await service.getDungeonObject(data.dungeonObjectEntities[0].id);
            expect(entity).toBeTruthy();

            await expect(dataService.teardown(data)).resolves.not.toThrow();
        });

        it('should throw with an invalid identifier', async () => {
            const data = new Data();
            await expect(dataService.setup(defaultDataConfig(), data)).resolves.not.toThrow();

            await expect(service.getDungeonObject(crypto.randomUUID())).rejects.toThrow('Record does not exist');

            await expect(dataService.teardown(data)).resolves.not.toThrow();
        });
    });
});
