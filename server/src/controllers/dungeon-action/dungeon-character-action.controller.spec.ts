import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { ContextIdFactory } from '@nestjs/core';

// Application
import { DatabaseModule, LoggerModule } from '@/core';
import { RepositoriesModule } from '@/repositories';
import { Data, DataModule, DataService, defaultDataConfig } from '@/common/data';
import { ServicesModule } from '@/services';
import { DungeonCharacterActionController } from './dungeon-character-action.controller';
import { DungeonActionDto } from './dto/dungeon-action.dto';

describe('DungeonCharacterActionController', () => {
    let module: TestingModule;
    let controller: DungeonCharacterActionController;
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
            controllers: [DungeonCharacterActionController],
        }).compile();
    });

    beforeEach(async () => {
        const contextId = ContextIdFactory.create();
        dataService = await module.resolve<DataService>(DataService, contextId);
        controller = await module.resolve<DungeonCharacterActionController>(
            DungeonCharacterActionController,
            contextId,
        );
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create one dungeon action', async () => {
            const data = new Data();
            await expect(dataService.setup(defaultDataConfig(), data)).resolves.not.toThrow();

            let dungeonActionDto: DungeonActionDto = await controller.create(
                data.dungeonCharacterEntities[0].dungeon_id,
                data.dungeonCharacterEntities[0].id,
                {
                    data: {
                        sentence: 'move north',
                    },
                },
            );
            expect(dungeonActionDto.data).toBeTruthy();
            expect(dungeonActionDto.data.length).toBeGreaterThan(0);
            expect(dungeonActionDto.data[0].action).toBeTruthy();

            data.addCharacterTeardownId(dungeonActionDto.data[0].action.id);
            await expect(dataService.teardown(data)).resolves.not.toThrow();
        });
    });
});
