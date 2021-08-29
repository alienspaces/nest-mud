import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { ContextIdFactory } from '@nestjs/core';

// Application
import { DatabaseModule, LoggerModule } from '@/core';
import { RepositoriesModule } from '@/repositories';
import { Data, DataModule, DataService, defaultDataConfig } from '@/common/data';
import { ServicesModule } from '@/services';
import { DungeonLocationsController } from './dungeon-location.controller';

describe('DungeonLocationsController', () => {
    let module: TestingModule;
    let controller: DungeonLocationsController;
    let dataService: DataService;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ ignoreEnvFile: false }),
                LoggerModule,
                DatabaseModule,
                RepositoriesModule,
                ServicesModule,
                DataModule,
            ],
            controllers: [DungeonLocationsController],
        }).compile();
    });

    beforeEach(async () => {
        const contextId = ContextIdFactory.create();
        dataService = await module.resolve<DataService>(DataService, contextId);
        controller = await module.resolve<DungeonLocationsController>(DungeonLocationsController, contextId);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('get', () => {
        it('should return one location', async () => {
            const data = new Data();
            await expect(dataService.setup(defaultDataConfig(), data)).resolves.not.toThrow();

            let response = await controller.get(data.dungeonEntities[0].id, data.dungeonLocationEntities[0].id);
            expect(response.data).toBeTruthy();
            expect(response.data.length).toEqual(1);

            await expect(dataService.teardown(data)).resolves.not.toThrow();
        });
    });
});
