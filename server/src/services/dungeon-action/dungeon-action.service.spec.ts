import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { ContextIdFactory } from '@nestjs/core';
import * as crypto from 'crypto';

// Application
import { DatabaseModule, LoggerModule } from '@/core';
import { RepositoriesModule } from '@/repositories';
import { Data, DataModule, DataService, defaultDataConfig } from '@/common/data';
import { ServicesModule } from '@/services/services.module';
import { DungeonActionService } from './dungeon-action.service';

describe('ActionsService', () => {
    let module: TestingModule;
    let service: DungeonActionService;
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
        service = await module.resolve<DungeonActionService>(DungeonActionService, contextId);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('processDungeonCharacterAction', () => {
        it('should process dungeon character action', async () => {
            const data = new Data();
            await expect(dataService.setup(defaultDataConfig(), data)).resolves.not.toThrow();

            const dungeonActionEntity = await service.processDungeonCharacterAction(
                data.dungeonCharacterEntities[0].id,
                'move north',
            );
            expect(dungeonActionEntity.id).toBeTruthy();

            await expect(dataService.teardown(data)).resolves.not.toThrow();
        });
    });
});
