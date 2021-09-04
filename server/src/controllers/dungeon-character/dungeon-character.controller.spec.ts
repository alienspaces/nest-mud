import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { ContextIdFactory } from '@nestjs/core';
import * as faker from 'faker';

// Application
import { DatabaseModule, LoggerModule } from '@/core';
import { RepositoriesModule } from '@/repositories';
import { Data, DataModule, DataService, defaultDataConfig } from '@/common/data';
import { ServicesModule } from '@/services';
import { DungeonCharacterDto } from './dto';
import { DungeonCharactersController } from './dungeon-character.controller';

describe('DungeonCharactersController', () => {
    let module: TestingModule;
    let controller: DungeonCharactersController;
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
            controllers: [DungeonCharactersController],
        }).compile();

        controller = await module.resolve<DungeonCharactersController>(DungeonCharactersController);
    });

    beforeEach(async () => {
        const contextId = ContextIdFactory.create();
        dataService = await module.resolve<DataService>(DataService, contextId);
        controller = await module.resolve<DungeonCharactersController>(DungeonCharactersController, contextId);
    });

    describe('get', () => {
        it('should get a character', async () => {
            const data = new Data();
            await expect(dataService.setup(defaultDataConfig(), data)).resolves.not.toThrow();

            let DungeonCharacterDto: DungeonCharacterDto = await controller.get(
                data.dungeonEntities[0].id,
                data.dungeonCharacterEntities[0].id,
            );
            expect(DungeonCharacterDto.data).toBeTruthy();
            expect(DungeonCharacterDto.data.length).toBeGreaterThan(0);

            await expect(dataService.teardown(data)).resolves.not.toThrow();
        });
    });

    describe('getMany', () => {
        it('should get a character', async () => {
            const data = new Data();
            await expect(dataService.setup(defaultDataConfig(), data)).resolves.not.toThrow();

            let DungeonCharacterDto: DungeonCharacterDto = await controller.getMany(data.dungeonEntities[0].id);
            expect(DungeonCharacterDto.data).toBeTruthy();
            expect(DungeonCharacterDto.data.length).toBeGreaterThan(0);

            await expect(dataService.teardown(data)).resolves.not.toThrow();
        });
    });

    describe('create', () => {
        it('should create a character', async () => {
            const data = new Data();
            await expect(dataService.setup(defaultDataConfig(), data)).resolves.not.toThrow();

            let dungeonCharacterDto: DungeonCharacterDto = await controller.create(data.dungeonEntities[0].id, {
                data: {
                    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
                    strength: faker.datatype.number(10),
                    dexterity: faker.datatype.number(10),
                    intelligence: faker.datatype.number(10),
                },
            });
            expect(dungeonCharacterDto.data).toBeTruthy();
            expect(dungeonCharacterDto.data.length).toBeGreaterThan(0);

            data.addCharacterTeardownId(dungeonCharacterDto.data[0].id);
            await expect(dataService.teardown(data)).resolves.not.toThrow();
        });
    });
});
