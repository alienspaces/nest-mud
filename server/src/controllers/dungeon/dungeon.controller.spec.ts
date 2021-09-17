import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { ContextIdFactory } from '@nestjs/core';

// Application
import { DatabaseModule, LoggerModule } from '@/core';
import { RepositoriesModule } from '@/repositories';
import { Data, DataModule, DataService, defaultDataConfig } from '@/common/data';
import { ServicesModule } from '@/services';
import { DungeonController } from './dungeon.controller';

describe('DungeonController', () => {
    let module: TestingModule;
    let controller: DungeonController;
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
            controllers: [DungeonController],
        }).compile();
    });

    beforeEach(async () => {
        const contextId = ContextIdFactory.create();
        dataService = await module.resolve<DataService>(DataService, contextId);
        controller = await module.resolve<DungeonController>(DungeonController, contextId);
    });

    describe('getOne', () => {
        it('should get one dungeon', async () => {
            const data = new Data();
            await expect(dataService.setup(defaultDataConfig(), data)).resolves.not.toThrow();

            let DungeonDto = await controller.getOne(data.dungeonEntities[0].id);
            expect(DungeonDto.data).toBeTruthy();
            expect(DungeonDto.data.length).toBeGreaterThan(0);

            await expect(dataService.teardown(data)).resolves.not.toThrow();
        });
    });

    describe('getMany', () => {
        it('should get many dungeons', async () => {
            const data = new Data();
            await expect(dataService.setup(defaultDataConfig(), data)).resolves.not.toThrow();

            let DungeonDto = await controller.getMany();
            expect(DungeonDto.data).toBeTruthy();
            expect(DungeonDto.data.length).toBeGreaterThan(0);

            await expect(dataService.teardown(data)).resolves.not.toThrow();
        });
    });
});
