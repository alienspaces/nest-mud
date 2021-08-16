import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import * as crypto from 'crypto';

// Application
import { DatabaseModule, LoggerModule, LoggerService } from '@/core';
import { RepositoriesModule } from '@/repositories';
import {
    Data,
    DataModule,
    DataService,
    defaultDataConfig,
} from '@/common/data';
import { ServicesModule } from '@/services/services.module';
import { DungeonService } from './dungeon.service';

describe('DungeonService', () => {
    let module: TestingModule;
    let service: DungeonService;

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
            providers: [LoggerService, DataService, DungeonService],
        }).compile();

        service = await module.resolve<DungeonService>(DungeonService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getDungeon', () => {
        it('should return a DungeonEntity with a valid identifier', async () => {
            const dataService = await module.resolve<DataService>(DataService);
            const data = new Data();
            await expect(
                dataService.setup(defaultDataConfig(), data),
            ).resolves.not.toThrow();

            const entity = await service.getDungeon(data.dungeonEntities[0].id);
            expect(entity).toBeTruthy();

            await expect(dataService.teardown(data)).resolves.not.toThrow();
        });

        it('should throw with an invalid identifier', async () => {
            await expect(
                service.getDungeon(crypto.randomUUID()),
            ).rejects.toThrow('Record does not exist');
        });
    });
});
