import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
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
            providers: [LoggerService, DataService, DungeonObjectService],
        }).compile();

        service = await module.resolve<DungeonObjectService>(DungeonObjectService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getDungeonObject', () => {
        it('should return a DungeonObjectEntity with a valid identifier', async () => {
            const dataService = await module.resolve<DataService>(DataService);
            const data = new Data();
            await expect(dataService.setup(defaultDataConfig(), data)).resolves.not.toThrow();

            const entity = await service.getDungeonObject(data.dungeonObjectEntities[0].id);
            expect(entity).toBeTruthy();

            await expect(dataService.teardown(data)).resolves.not.toThrow();
        });

        it('should throw with an invalid identifier', async () => {
            await expect(service.getDungeonObject(crypto.randomUUID())).rejects.toThrow('Record does not exist');
        });
    });
});
