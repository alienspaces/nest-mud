/*
 * This file was generated by a tool.
 * Rerun ./script/db-repositories.mjs to regenerate this file.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';

// Application
import { DatabaseModule, LoggerModule } from '@/core';
import { DungeonMonsterRepositoryRecord, DungeonMonsterRepository } from './dungeon-monster.repository';

describe('DungeonMonsterRepository', () => {
    let repository: DungeonMonsterRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ ignoreEnvFile: false }),
                DatabaseModule,
                LoggerModule,
            ],
            providers: [DungeonMonsterRepository],
        }).compile();

        repository = await module.resolve<DungeonMonsterRepository>(
            DungeonMonsterRepository,
        );
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });
});
