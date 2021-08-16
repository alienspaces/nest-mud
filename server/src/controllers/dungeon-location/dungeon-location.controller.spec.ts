import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';

// Application
import { DatabaseModule, LoggerModule, LoggerService } from '@/core';
import { ServicesModule } from '@/services';
import { Data, DataService, defaultDataConfig } from '@/common/data';

import { DungeonLocationsController } from './dungeon-location.controller';
import { RepositoriesModule } from '@/repositories';

describe('DungeonLocationsController', () => {
    let module: TestingModule;
    let controller: DungeonLocationsController;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ ignoreEnvFile: false }),
                LoggerModule,
                DatabaseModule,
                RepositoriesModule,
                ServicesModule,
            ],
            controllers: [DungeonLocationsController],
            providers: [LoggerService, DataService],
        }).compile();

        controller = await module.resolve<DungeonLocationsController>(
            DungeonLocationsController,
        );
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('get', () => {
        it('should return one location', async () => {
            const service = await module.resolve<DataService>(DataService);
            const data = new Data();
            await expect(
                service.setup(defaultDataConfig(), data),
            ).resolves.not.toThrow();

            let response = await controller.get(
                data.dungeonLocationEntities[0].id,
            );
            expect(response.data).toBeTruthy();
            expect(response.data.length).toEqual(1);

            await expect(service.teardown(data)).resolves.not.toThrow();
        });
    });
});
