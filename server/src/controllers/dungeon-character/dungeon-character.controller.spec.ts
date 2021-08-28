import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import * as faker from 'faker';

// Application
import { DatabaseModule, LoggerModule, LoggerService } from '@/core';
import { RepositoriesModule } from '@/repositories';
import { Data, DataModule, DataService, defaultDataConfig } from '@/common/data';
import { DungeonCharacterService, ServicesModule } from '@/services';
import { DungeonCharacterDto } from './dto';
import { DungeonCharactersController } from './dungeon-character.controller';

describe('DungeonCharactersController', () => {
    let controller: DungeonCharactersController;
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
            controllers: [DungeonCharactersController],
            providers: [LoggerService, DataService, DungeonCharacterService],
        }).compile();

        controller = await module.resolve<DungeonCharactersController>(DungeonCharactersController);
    });

    describe('get', () => {
        it('should get a character', async () => {
            const service = await module.resolve<DataService>(DataService);
            const data = new Data();
            await expect(service.setup(defaultDataConfig(), data)).resolves.not.toThrow();

            let DungeonCharacterDto: DungeonCharacterDto = await controller.get(
                data.dungeonEntities[0].id,
                data.dungeonCharacterEntities[0].id,
            );
            expect(DungeonCharacterDto.data).toBeTruthy();
            expect(DungeonCharacterDto.data.length).toBeGreaterThan(0);

            await expect(service.teardown(data)).resolves.not.toThrow();
        });
    });

    describe('getMany', () => {
        it('should get a character', async () => {
            const service = await module.resolve<DataService>(DataService);
            const data = new Data();
            await expect(service.setup(defaultDataConfig(), data)).resolves.not.toThrow();

            let DungeonCharacterDto: DungeonCharacterDto = await controller.getMany(data.dungeonEntities[0].id);
            expect(DungeonCharacterDto.data).toBeTruthy();
            expect(DungeonCharacterDto.data.length).toBeGreaterThan(0);

            await expect(service.teardown(data)).resolves.not.toThrow();
        });
    });

    describe('create', () => {
        it('should create a character', async () => {
            const service = await module.resolve<DataService>(DataService);
            const data = new Data();
            await expect(service.setup(defaultDataConfig(), data)).resolves.not.toThrow();

            let DungeonCharacterDto: DungeonCharacterDto = await controller.create(data.dungeonEntities[0].id, {
                data: {
                    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
                    strength: faker.datatype.number(10),
                    dexterity: faker.datatype.number(10),
                    intelligence: faker.datatype.number(10),
                },
            });
            expect(DungeonCharacterDto.data).toBeTruthy();
            expect(DungeonCharacterDto.data.length).toBeGreaterThan(0);

            data.addCharacterTeardownId(DungeonCharacterDto.data[0].id);

            await expect(service.teardown(data)).resolves.not.toThrow();
        });
    });
});
