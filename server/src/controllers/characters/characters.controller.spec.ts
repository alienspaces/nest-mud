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
import { CharacterService, ServicesModule } from '@/services';
import { CharacterDto } from './dto';
import { CharactersController } from './characters.controller';

describe('CharactersController', () => {
    let controller: CharactersController;
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
            controllers: [CharactersController],
            providers: [LoggerService, DataService, CharacterService],
        }).compile();

        controller = await module.resolve<CharactersController>(
            CharactersController,
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

            let characterDto: CharacterDto = await controller.create(
                data.dungeonEntities[0].id,
                {
                    data: {
                        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
                        strength: faker.datatype.number(10),
                        dexterity: faker.datatype.number(10),
                        intelligence: faker.datatype.number(10),
                    },
                },
            );
            expect(characterDto.data).toBeTruthy();
            expect(characterDto.data.length).toBeGreaterThan(0);

            // TODO: Make data service teardown a list of ids so we
            // can easily add data to it..
            data.addCharacterTeardownId(characterDto.data[0].id);

            await service.teardown(data);
        });
    });
});
