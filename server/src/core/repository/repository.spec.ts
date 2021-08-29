import { Test, TestingModule } from '@nestjs/testing';
import { ContextIdFactory } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

// Application
import { DatabaseModule, DatabaseService, LoggerModule } from '@/core';
import { RepositoryOperator, RepositoryOrder } from './repository';
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
            imports: [ConfigModule.forRoot({ ignoreEnvFile: false }), DatabaseModule, LoggerModule],
            providers: [TestRepository],
        }).compile();

        const contextId = ContextIdFactory.create();
        databaseService = await module.resolve<DatabaseService>(DatabaseService, contextId);
        repository = await module.resolve<TestRepository>(TestRepository, contextId);

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
        await databaseService.end(true);
    });

    afterAll(async () => {
        const client = await databaseService.connect();
        await client.query('DROP TABLE IF EXISTS "test";');
        await databaseService.end(true);
    });

    beforeEach(async () => {
        const client = await databaseService.connect();
        await client.query(`
INSERT INTO test (id, name, age, created_at) VALUES ('${record.id}', '${record.name}', ${
            record.age
        }, '${record.created_at.toISOString()}');
        `);
    });

    afterEach(async () => {
        const client = databaseService.client;
        await client.query(`
        DELETE FROM test;
                `);
        await databaseService.end(true);
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
                'SELECT "id", "name", "age", "created_at", "updated_at", "deleted_at" FROM test WHERE "id" = $1 AND "deleted_at" IS NULL',
            );
        });

        it('should build select SQL with limit', () => {
            const sql = repository.buildSelectSQL({
                parameters: [
                    {
                        column: 'id',
                        value: '635e27fe-9bc0-4dfb-b2a1-844faa2965b2',
                        operator: RepositoryOperator.Equal,
                    },
                ],
                limit: 1,
            });
            expect(sql).toEqual(
                'SELECT "id", "name", "age", "created_at", "updated_at", "deleted_at" FROM test WHERE "id" = $1 AND "deleted_at" IS NULL LIMIT 1',
            );
        });

        it('should build select SQL with order by', () => {
            const sql = repository.buildSelectSQL({
                parameters: [
                    {
                        column: 'id',
                        value: '635e27fe-9bc0-4dfb-b2a1-844faa2965b2',
                        operator: RepositoryOperator.Equal,
                    },
                ],
                orderByColumn: 'age',
                orderByDirection: RepositoryOrder.Descending,
            });
            expect(sql).toEqual(
                'SELECT "id", "name", "age", "created_at", "updated_at", "deleted_at" FROM test WHERE "id" = $1 AND "deleted_at" IS NULL ORDER BY "age" DESC',
            );
        });

        it('should build select SQL with between operator', () => {
            const sql = repository.buildSelectSQL({
                parameters: [
                    {
                        column: 'age',
                        value: [10, 20],
                        operator: RepositoryOperator.Between,
                    },
                ],
            });
            expect(sql).toEqual(
                'SELECT "id", "name", "age", "created_at", "updated_at", "deleted_at" FROM test WHERE "age" BETWEEN $1 AND $2 AND "deleted_at" IS NULL',
            );
        });

        it('should build select SQL for update', () => {
            const sql = repository.buildSelectSQL({
                parameters: [
                    {
                        column: 'age',
                        value: 10,
                    },
                ],
                forUpdate: true,
            });
            expect(sql).toEqual(
                'SELECT "id", "name", "age", "created_at", "updated_at", "deleted_at" FROM test WHERE "age" = $1 AND "deleted_at" IS NULL FOR UPDATE',
            );
        });
    });

    describe('buildInsertSQL', () => {
        it('should build insert SQL', () => {
            const sql = repository.buildInsertSQL();
            expect(sql).toEqual(
                'INSERT INTO test ("id", "name", "age", "created_at", "updated_at", "deleted_at") VALUES ($1, $2, $3, $4, $5, $6) RETURNING "id", "name", "age", "created_at", "updated_at", "deleted_at"',
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
                'UPDATE test SET "id" = $1, "name" = $2, "age" = $3, "created_at" = $4, "updated_at" = $5, "deleted_at" = $6 WHERE "id" = $1 AND "deleted_at" IS NULL RETURNING "id", "name", "age", "created_at", "updated_at", "deleted_at"',
            );
        });
    });

    describe('buildDeleteSQL', () => {
        it('should build delete SQL', () => {
            const sql = repository.buildDeleteSQL({
                parameters: [
                    {
                        column: 'id',
                        value: '635e27fe-9bc0-4dfb-b2a1-844faa2965b2',
                        operator: RepositoryOperator.Equal,
                    },
                ],
            });
            expect(sql).toEqual(
                'UPDATE test SET "deleted_at" = NOW() WHERE "id" = $1 AND "deleted_at" IS NULL RETURNING "id", "name", "age", "created_at", "updated_at", "deleted_at"',
            );
        });
    });

    describe('getOne', () => {
        it('should throw when record cannot be found', async () => {
            await expect(
                repository.getOne({
                    id: '9da58182-76d6-4a2b-a7dd-8eaba788cb24',
                }),
            ).rejects.toThrow('Record does not exist');
        });

        it('should return expected record', async () => {
            let resultRecord: TestRecord;
            resultRecord = await repository.getOne({
                id: `${record.id}`,
            });
            expect(resultRecord.id).toEqual(record.id);
            expect(resultRecord.name).toEqual(record.name);
            expect(resultRecord.age).toEqual(record.age);
            expect(resultRecord.created_at).toBeTruthy();
        });
    });

    describe('getMany', () => {
        it('should return no records with operator equal', async () => {
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
        it('should return expected records with operator equal', async () => {
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
        it('should return expected records with array value and operator in', async () => {
            let resultRecords = await repository.getMany({
                parameters: [
                    {
                        column: 'age',
                        value: [record.age],
                        operator: RepositoryOperator.In,
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
    });

    describe('updateOne', () => {
        it('should update a record', async () => {
            record.age = 50;
            await repository.updateOne({ record: record });
            expect(record.age).toEqual(50);
            expect(record.updated_at).toBeTruthy();
            expect(record.deleted_at).toBeFalsy();
        });
    });

    describe('deleteOne', () => {
        it('should not throw when deleting a valid record', async () => {
            await expect(
                repository.deleteOne({
                    id: `${record.id}`,
                }),
            ).resolves.not.toThrow();

            await expect(
                repository.getOne({
                    id: `${record.id}`,
                }),
            ).rejects.toThrow('Record does not exist');
        });

        it('should throw when deleting an invalid record', async () => {
            await expect(
                repository.deleteOne({
                    id: 'df85976a-8764-4d33-a5c5-ceabcae2b366',
                }),
            ).rejects.toThrow('Failed deleting row');
        });
    });
});
