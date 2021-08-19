import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';

// Application
import { DatabaseModule, LoggerModule, LoggerService } from '@/core';
import { RepositoriesModule } from '@/repositories';
import {
    Data,
    DataModule,
    DataService,
    defaultDataConfig,
} from '@/common/data';
import { DungeonService, ServicesModule } from '@/services';
import { DungeonController } from './dungeon.controller';

describe('DungeonController', () => {
    let controller: DungeonController;
    let module: TestingModule;

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
            providers: [LoggerService, DataService, DungeonService],
        }).compile();

        controller = await module.resolve<DungeonController>(DungeonController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getOne', () => {
        it('should get one dungeon', async () => {
            const service = await module.resolve<DataService>(DataService);
            const data = new Data();
            await expect(
                service.setup(defaultDataConfig(), data),
            ).resolves.not.toThrow();

            let DungeonDto = await controller.getOne(
                data.dungeonEntities[0].id,
            );
            expect(DungeonDto.data).toBeTruthy();
            expect(DungeonDto.data.length).toBeGreaterThan(0);

            await expect(service.teardown(data)).resolves.not.toThrow();
        });
    });

    describe('getMany', () => {
        it('should get many dungeons', async () => {
            const service = await module.resolve<DataService>(DataService);
            const data = new Data();
            await expect(
                service.setup(defaultDataConfig(), data),
            ).resolves.not.toThrow();

            let DungeonDto = await controller.getMany();
            expect(DungeonDto.data).toBeTruthy();
            expect(DungeonDto.data.length).toBeGreaterThan(0);

            await expect(service.teardown(data)).resolves.not.toThrow();
        });
    });
});
