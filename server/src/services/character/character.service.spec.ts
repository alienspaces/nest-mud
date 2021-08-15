import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';

// Application
import { DatabaseModule, LoggerModule, LoggerService } from '@/core';
import { CharacterService } from './character.service';
import { DungeonService } from '@/services';
import {
    RepositoriesModule,
    CharacterRepositoryRecord,
    DungeonLocationRepositoryRecord,
} from '@/repositories';

describe('CharacterService', () => {
    let service: CharacterService;
    let dungeonService: DungeonService;
    let characterService: CharacterService;
    let locationRecord: DungeonLocationRepositoryRecord;
    let characterRecord: CharacterRepositoryRecord;

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
                CharacterService,
                CharacterService,
            ],
        }).compile();

        dungeonService = await module.resolve<DungeonService>(DungeonService);
        characterService = await module.resolve<CharacterService>(
            CharacterService,
        );
        service = module.get<CharacterService>(CharacterService);
    });

    afterAll(async () => {});

    beforeEach(async () => {
        // TODO: Create location and character records
    });

    afterEach(async () => {
        // TODO: Remove location and character records
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
