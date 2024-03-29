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
            // Action
            expect(dungeonActionDto.data[0].action).toBeTruthy();
            expect(dungeonActionDto.data[0].action.command).toBeTruthy();
            // Character
            expect(dungeonActionDto.data[0].character).toBeTruthy();
            expect(dungeonActionDto.data[0].character.name).toBeTruthy();
            // Location
            expect(dungeonActionDto.data[0].location).toBeTruthy();
            expect(dungeonActionDto.data[0].location.name).toBeTruthy();
            expect(dungeonActionDto.data[0].location.description).toBeTruthy();
            expect(dungeonActionDto.data[0].location.directions.length).toBeGreaterThan(0);
            expect(dungeonActionDto.data[0].characters).toBeTruthy();
            expect(dungeonActionDto.data[0].characters.length).toEqual(1);
            expect(dungeonActionDto.data[0].monsters).toBeTruthy();
            expect(dungeonActionDto.data[0].monsters.length).toEqual(1);

            data.addActionTeardownId(dungeonActionDto.data[0].action.id);
            await expect(dataService.teardown(data)).resolves.not.toThrow();
        });
    });
});
