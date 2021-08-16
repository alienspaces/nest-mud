import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import * as faker from 'faker';

// Application
import { DatabaseModule, LoggerModule, LoggerService } from '@/core';
import { RepositoriesModule } from '@/repositories';
import {
    Data,
    DataModule,
    DataService,
    defaultDataConfig,
} from '@/common/data';
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

        controller = await module.resolve<DungeonCharactersController>(
            DungeonCharactersController,
        );
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a character', async () => {
            const service = await module.resolve<DataService>(DataService);
            const data = new Data();
            await service.setup(defaultDataConfig(), data);

            let DungeonCharacterDto: DungeonCharacterDto =
                await controller.create(data.dungeonEntities[0].id, {
                    data: {
                        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
                        strength: faker.datatype.number(10),
                        dexterity: faker.datatype.number(10),
                        intelligence: faker.datatype.number(10),
                    },
                });
            expect(DungeonCharacterDto.data).toBeTruthy();
            expect(DungeonCharacterDto.data.length).toBeGreaterThan(0);

            // TODO: Make data service teardown a list of ids so we
            // can easily add data to it..
            data.addCharacterTeardownId(DungeonCharacterDto.data[0].id);

            await service.teardown(data);
        });
    });
});
