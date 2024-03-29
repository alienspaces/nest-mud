/*
 * This file was generated by a tool.
 * Rerun ./script/db-repositories.mjs to regenerate this file.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';

// Application
import { DatabaseModule, LoggerModule } from '@/core';
import { DungeonObjectRepositoryRecord, DungeonObjectRepository } from './dungeon-object.repository';

describe('DungeonObjectRepository', () => {
    let repository: DungeonObjectRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ ignoreEnvFile: false }),
                DatabaseModule,
                LoggerModule,
            ],
            providers: [DungeonObjectRepository],
        }).compile();

        repository = await module.resolve<DungeonObjectRepository>(
            DungeonObjectRepository,
        );
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });
});
