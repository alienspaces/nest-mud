import { Test, TestingModule } from '@nestjs/testing';
import { ContextIdFactory } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

// Application
import { DatabaseModule, DatabaseService, LoggerModule } from '@/core';
import { RepositoryOperator } from './repository';
import { TestRepository, TestRecord } from './test.repository';

const record: TestRecord = {
    id: 'da9c5169-17ad-471c-8c04-1b70078aef79',
    name: 'Sir Barricade of the Wall',
    age: 49,
    created_at: new Date(new Date().toUTCString()),
};

describe('Repository', () => {
    let repository: TestRepository;
    let databaseService: DatabaseService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ ignoreEnvFile: false }),
                DatabaseModule,
                LoggerModule,
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
INSERT INTO test (id, name, age, created_at) VALUES ('${record.id}', '${
            record.name
        }', ${record.age}, '${record.created_at.toISOString()}');
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
                        operator: RepositoryOperator.Equal,
                    },
                ],
            });
            expect(sql).toEqual(
                'SELECT id, name, age, created_at, updated_at, deleted_at FROM test WHERE id = $1 AND deleted_at IS NULL',
            );
        });
    });

    describe('buildInsertSQL', () => {
        it('should build insert SQL', () => {
            const sql = repository.buildInsertSQL();
            expect(sql).toEqual(
                'INSERT INTO test (id, name, age, created_at, updated_at, deleted_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, age, created_at, updated_at, deleted_at',
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
                        operator: RepositoryOperator.Equal,
                    },
                ],
            });
            expect(sql).toEqual(
                'UPDATE test SET id = $1, name = $2, age = $3, created_at = $4, updated_at = $5, deleted_at = $6 WHERE id = $1 AND deleted_at IS NULL RETURNING id, name, age, created_at, updated_at, deleted_at',
            );
        });
    });

    describe('getOne', () => {
        it('should throw when missing primary key column parameters', async () => {
            await expect(
                repository.getOne({
                    parameters: [
                        {
                            column: 'age',
                            value: 14,
                            operator: RepositoryOperator.Equal,
                        },
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
                    },
                ],
            });
            expect(resultRecord.id).toEqual(record.id);
            expect(resultRecord.name).toEqual(record.name);
            expect(resultRecord.age).toEqual(record.age);
            expect(resultRecord.created_at).toBeTruthy();
        });
    });

    describe('getMany', () => {
        it('should return no records', async () => {
            let resultRecords = await repository.getMany({
                parameters: [
                    {
                        column: 'age',
                        value: 14,
                        operator: RepositoryOperator.Equal,
                    },
                ],
            });
            expect(resultRecords.length).toEqual(0);
        });
        it('should return expected records', async () => {
            let resultRecords = await repository.getMany({
                parameters: [
                    {
                        column: 'age',
                        value: record.age,
                        operator: RepositoryOperator.Equal,
                    },
                ],
            });
            expect(resultRecords.length).toEqual(1);
        });
    });

    describe('insertOne', () => {
        it('should create a record', async () => {
            let insertRecord: TestRecord = {
                name: 'Legislate Law',
                age: 49,
            };
            await repository.insertOne({ record: insertRecord });
            expect(insertRecord.id).toBeTruthy();
            expect(insertRecord.created_at).toBeTruthy();
            expect(insertRecord.updated_at).toBeFalsy();
            expect(insertRecord.deleted_at).toBeFalsy();
        });

        // TODO: Test default values applied as expected
    });

    describe('updateOne', () => {
        it('should update a record', async () => {
            record.age = 50;
            await repository.updateOne({ record: record });
            expect(record.age).toEqual(50);
            expect(record.updated_at).toBeTruthy();
            expect(record.deleted_at).toBeFalsy();
        });

        // TODO: Test default values applied as expected
    });
});
