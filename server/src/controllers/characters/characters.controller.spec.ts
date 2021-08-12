import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';

// Application
import { DatabaseModule } from '@/core';
import { RepositoriesModule } from '@/repositories';
import { CharactersController } from './characters.controller';
import { CharactersService } from '@/services/characters/characters.service';

describe('CharactersController', () => {
    let controller: CharactersController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ ignoreEnvFile: false }),
                DatabaseModule,
                RepositoriesModule,
            ],
            controllers: [CharactersController],
            providers: [CharactersService],
        }).compile();

        controller = module.get<CharactersController>(CharactersController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
