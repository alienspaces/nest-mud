import { Injectable } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';

// Application
import { DatabaseModule } from '@/core';
import { Repository, Operator } from './repository';
import { TestRepository } from './test.repository';

describe('Repository', () => {
    let repository: TestRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ ignoreEnvFile: false }),
                DatabaseModule,
            ],
            providers: [TestRepository],
        }).compile();

        // NOTE: Must await.resolve as we have request scoped dependencies
        repository = await module.resolve<TestRepository>(TestRepository);
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });

    describe('buildSelectSQL', () => {
        it('should build select SQL', () => {
            const sql = repository.buildSelectSQL({
                parameters: [
                    {
                        column: 'id',
                        value: '635e27fe-9bc0-4dfb-b2a1-844faa2965b2',
                        operator: Operator.Equal,
                    },
                ],
            });
            expect(sql).toEqual(
                'SELECT id, name, age FROM test WHERE id = $1 AND deleted_at IS NULL',
            );
        });
    });

    describe('buildInsertSQL', () => {
        it('should build insert SQL', () => {
            const sql = repository.buildInsertSQL();
            expect(sql).toEqual(
                'INSERT INTO test (id, name, age) VALUES ($1, $2, $3)',
            );
        });
    });

    describe('buildUpdateSQL', () => {
        it('should build update SQL', () => {
            const sql = repository.buildUpdateSQL({
                parameters: [
                    {
                        column: 'id',
                        value: '635e27fe-9bc0-4dfb-b2a1-844faa2965b2',
                        operator: Operator.Equal,
                    },
                ],
            });
            expect(sql).toEqual(
                'UPDATE test SET id = $1, name = $2, age = $3 WHERE id = $1 AND deleted_at IS NULL',
            );
        });
    });
});
