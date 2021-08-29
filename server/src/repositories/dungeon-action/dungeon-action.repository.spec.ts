/*
 * This file was generated by a tool.
 * Rerun ./script/db-repositories.mjs to regenerate this file.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';

// Application
import { DatabaseModule, LoggerModule } from '@/core';
import { DungeonActionRepositoryRecord, DungeonActionRepository } from './dungeon-action.repository';

describe('DungeonActionRepository', () => {
    let repository: DungeonActionRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ ignoreEnvFile: false }),
                DatabaseModule,
                LoggerModule,
            ],
            providers: [DungeonActionRepository],
        }).compile();

        repository = await module.resolve<DungeonActionRepository>(
            DungeonActionRepository,
        );
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });
});
