import { Repository, Operator } from './repository';

describe('Repository', () => {
    let repository: Repository;

    beforeEach(async () => {
        repository = new Repository('test', {
            id: '',
            name: '',
        });
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
            expect(sql).toEqual('SELECT id, name FROM test WHERE id = $1');
        });
    });

    describe('buildInsertSQL', () => {
        it('should build insert SQL', () => {
            const sql = repository.buildInsertSQL();
            expect(sql).toEqual('INSERT INTO test (id, name) VALUES ($1, $2)');
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
                'UPDATE test SET id = $1, name = $2 WHERE id = $1',
            );
        });
    });
});
