import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';

// Application
import { DatabaseModule, LoggerModule, LoggerService } from '@/core';
import { DungeonCharacterService } from './dungeon-character.service';
import { DungeonService } from '@/services';
import { RepositoriesModule } from '@/repositories';

describe('CharacterService', () => {
    let service: DungeonCharacterService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ ignoreEnvFile: false }),
                DatabaseModule,
                LoggerModule,
                RepositoriesModule,
            ],
            providers: [
                LoggerService,
                DungeonService,
                DungeonCharacterService,
                DungeonCharacterService,
            ],
        }).compile();

        service = module.get<DungeonCharacterService>(DungeonCharacterService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
