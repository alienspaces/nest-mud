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
import { DungeonCharacterActionService } from './dungeon-character-action.service';

describe('CharacterService', () => {
    let module: TestingModule;
    let service: DungeonCharacterActionService;

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
            providers: [
                LoggerService,
                DataService,
                DungeonCharacterActionService,
            ],
        }).compile();

        service = await module.resolve<DungeonCharacterActionService>(
            DungeonCharacterActionService,
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getDungeonCharacterAction', () => {
        it.skip('should return a DungeonCharacterActionEntity with a valid identifier', async () => {
            const dataService = await module.resolve<DataService>(DataService);
            const data = new Data();
            await expect(
                dataService.setup(defaultDataConfig(), data),
            ).resolves.not.toThrow();

            const entity = await service.getDungeonCharacterAction(
                data.dungeonCharacterEntities[0].id,
            );
            expect(entity).toBeTruthy();

            await expect(dataService.teardown(data)).resolves.not.toThrow();
        });

        it('should throw with an invalid identifier', async () => {
            await expect(
                service.getDungeonCharacterAction(crypto.randomUUID()),
            ).rejects.toThrow('Record does not exist');
        });
    });
});