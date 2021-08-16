import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';

// Application
import { DatabaseModule, LoggerModule, LoggerService } from '@/core';
import { DungeonLocationService } from './dungeon-location.service';
import { RepositoriesModule } from '@/repositories';

describe('DungeonLocationService', () => {
    let service: DungeonLocationService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ ignoreEnvFile: false }),
                DatabaseModule,
                LoggerModule,
                RepositoriesModule,
            ],
            providers: [LoggerService, DungeonLocationService],
        }).compile();

        service = module.get<DungeonLocationService>(DungeonLocationService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
