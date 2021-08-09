import { Injectable } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { ContextIdFactory } from '@nestjs/core';

// Application
import { DatabaseModule, DatabaseService } from '@/core';
import { Operator } from './repository';
import { TestRepository, TestRecord } from './test.repository';

const record: TestRecord = {
    id: 'da9c5169-17ad-471c-8c04-1b70078aef79',
    name: 'Sir Barricade of the Wall',
    age: 49,
};

describe('Repository', () => {
    let repository: TestRepository;
    let databaseService: DatabaseService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ ignoreEnvFile: false }),
                DatabaseModule,
            ],
            providers: [TestRepository],
        }).compile();

        const contextId = ContextIdFactory.create();
        databaseService = await module.resolve<DatabaseService>(
            DatabaseService,
            contextId,
        );
        repository = await module.resolve<TestRepository>(
            TestRepository,
            contextId,
        );

        const client = await databaseService.connect();
        await client.query(`
CREATE TABLE IF NOT EXISTS "test" (
    "id"         uuid CONSTRAINT test_pk PRIMARY KEY DEFAULT gen_random_uuid(),
    "name"       text NOT NULL,
    "age"        integer NOT NULL,
    "created_at" timestamp NOT NULL DEFAULT (current_timestamp),
    "updated_at" timestamp DEFAULT null,
    "deleted_at" timestamp DEFAULT null
);        
        `);
        await databaseService.end();
    });

    afterAll(async () => {
        const client = await databaseService.connect();
        await client.query('DROP TABLE IF EXISTS "test";');
        await databaseService.end();
    });

    beforeEach(async () => {
        const client = await databaseService.connect();
        await client.query(`
INSERT INTO test (id, name, age) VALUES ('${record.id}', '${record.name}', ${record.age});
        `);
    });

    afterEach(async () => {
        const client = await databaseService.connect();
        await client.query(`
DELETE FROM test;
        `);
        await databaseService.end();
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

    describe('getOne', () => {
        it('should throw when missing primary key column parameters', async () => {
            await expect(
                repository.getOne({
                    parameters: [
                        { column: 'age', value: 14, operator: Operator.Equal },
                    ],
                }),
            ).rejects.toThrow('Missing primary key');
        });

        it('should throw when record cannot be found', async () => {
            await expect(
                repository.getOne({
                    parameters: [
                        {
                            column: 'id',
                            value: '9da58182-76d6-4a2b-a7dd-8eaba788cb24',
                            operator: Operator.Equal,
                        },
                    ],
                }),
            ).rejects.toThrow('Record does not exist');
        });

        it('should return expected record', async () => {
            let resultRecord: TestRecord;
            resultRecord = await repository.getOne({
                parameters: [
                    {
                        column: 'id',
                        value: `${record.id}`,
                        operator: Operator.Equal,
                    },
                ],
            });
            expect(resultRecord).toEqual(record);
        });
    });
});
