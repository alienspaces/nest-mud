import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';

// Application
import { DatabaseModule, LoggerModule, LoggerService } from '@/core';
import { DungeonService } from './dungeon.service';
import { RepositoriesModule } from '@/repositories';

describe('DungeonService', () => {
    let service: DungeonService;

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

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
