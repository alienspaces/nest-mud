import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import * as faker from 'faker';

// Application
import { DatabaseModule, LoggerModule, LoggerService } from '@/core';
import { RepositoriesModule } from '@/repositories';
import { CharactersController } from './characters.controller';
import { CharacterService } from '@/services/character/character.service';
import { CharacterDto } from './dto';

describe('CharactersController', () => {
    let controller: CharactersController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ ignoreEnvFile: false }),
                DatabaseModule,
                LoggerModule,
                RepositoriesModule,
            ],
            controllers: [CharactersController],
            providers: [LoggerService, CharacterService],
        }).compile();

        controller = await module.resolve<CharactersController>(
            CharactersController,
        );
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it.skip('should create a character', async () => {
            let characterDto: CharacterDto = await controller.create({
                data: {
                    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
                    strength: faker.datatype.number(10),
                    dexterity: faker.datatype.number(10),
                    intelligence: faker.datatype.number(10),
                },
            });
            expect(characterDto.data).toBeTruthy();
            expect(characterDto.data.length).toBeGreaterThan(0);
        });
    });
});
