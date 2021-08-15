import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';

// Application
import { DatabaseModule, LoggerModule, LoggerService } from '@/core';
import { DungeonService } from './dungeon.service';
import {
    RepositoriesModule,
    DungeonRepositoryRecord,
    DungeonLocationRepositoryRecord,
} from '@/repositories';

describe('DungeonService', () => {
    let service: DungeonService;
    let locationRecord: DungeonLocationRepositoryRecord;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ ignoreEnvFile: false }),
                DatabaseModule,
                LoggerModule,
                RepositoriesModule,
            ],
            providers: [LoggerService, DungeonService],
        }).compile();

        service = module.get<DungeonService>(DungeonService);
    });

    afterAll(async () => {});

    beforeEach(async () => {
        // TODO: Create location records
    });

    afterEach(async () => {
        // TODO: Remove location records
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
