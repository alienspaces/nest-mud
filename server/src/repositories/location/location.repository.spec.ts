/*
 * This file was generated by a tool.
 * Rerun ./script/db-repositories.mjs to regenerate this file.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

// Application
import { DatabaseService } from '@/core/database/database.service';
import { Location, LocationRepository } from './location.repository';

describe('LocationRepository', () => {
    let repository: LocationRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ConfigService, DatabaseService, LocationRepository],
        }).compile();

        // NOTE: Must await.resolve as we have request scoped dependencies
        repository = await module.resolve<LocationRepository>(
            LocationRepository,
        );
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });

    describe('buildInserSQL', () => {
        it('should return SQL', () => {
            const sql = repository.buildInsertSQL();
        });
    });
});