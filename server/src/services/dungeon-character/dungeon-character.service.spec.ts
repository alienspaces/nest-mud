import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { ContextIdFactory } from '@nestjs/core';
import * as crypto from 'crypto';

// Application
import { DatabaseModule, LoggerModule, LoggerService } from '@/core';
import { RepositoriesModule } from '@/repositories';
import { Data, DataModule, DataService, defaultDataConfig } from '@/common/data';
import { ServicesModule } from '@/services/services.module';
import { DungeonCharacterService } from './dungeon-character.service';

describe('CharacterService', () => {
    let module: TestingModule;
    let service: DungeonCharacterService;
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

    beforeEach(async () => {
        const contextId = ContextIdFactory.create();
        dataService = await module.resolve<DataService>(DataService, contextId);
        service = await module.resolve<DungeonCharacterService>(DungeonCharacterService, contextId);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getDungeonCharacter', () => {
        it('should return a DungeonCharacterEntity with a valid identifier', async () => {
            const data = new Data();
            await expect(dataService.setup(defaultDataConfig(), data)).resolves.not.toThrow();

            const entity = await service.getDungeonCharacter(data.dungeonCharacterEntities[0].id);
            expect(entity).toBeTruthy();

            await expect(dataService.teardown(data)).resolves.not.toThrow();
        });

        it('should throw with an invalid identifier', async () => {
            const data = new Data();
            await expect(dataService.setup(defaultDataConfig(), data)).resolves.not.toThrow();

            await expect(service.getDungeonCharacter(crypto.randomUUID())).rejects.toThrow('Record does not exist');

            await expect(dataService.teardown(data)).resolves.not.toThrow();
        });
    });
});
