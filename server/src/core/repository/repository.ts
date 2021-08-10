// Application
import { DatabaseService } from '@/core';

export enum Operator {
    Equal,
    NotEqual,
    LessThan,
    GreaterThan,
    LessThanEqual,
    GreaterThanEqual,
}

export interface Parameter<TRecord> {
    column: keyof TRecord;
    value: any;
    operator?: Operator;
}

export interface ColumnConfig {
    name: string;
    primary: boolean;
    type: any;
    defaultValue: () => any;
}

export interface TableConfig {
    name: string;
    columns: ColumnConfig[];
}

export interface ColumnConfig {
    name: string;
    isPrimary: boolean;
    isNullable: boolean;
}

export abstract class Repository<TRecord> {
    table: string;
    columns: any;
    private primaryColumnNames: string[];
    private columnNames: string[];

    constructor(
        private databaseService: DatabaseService,
        table: string,
        columns: ColumnConfig[],
    ) {
        this.databaseService = databaseService;
        this.table = table;
        this.columns = columns;
        this.columnNames = this.columns.map(
            (column: ColumnConfig) => column.name,
        );
        this.primaryColumnNames = this.columns.reduce(
            (primaryColumnNames: string[], column: ColumnConfig) => {
                column.isPrimary ? primaryColumnNames.push(column.name) : null;
                return primaryColumnNames;
            },
            [],
        );
    }

    buildSelectSQL<TRecord>(args: {
        parameters?: Parameter<TRecord>[];
        forUpdate?: boolean;
        offset?: number;
        limit?: number;
    }): string {
        let sql = `SELECT `;
        this.columnNames.forEach((columnName) => {
            sql += `${columnName}, `;
        });
        sql = sql.substring(0, sql.length - 2);
        sql += ` FROM ${this.table}`;
        if (args.parameters) {
            sql += ' WHERE ';
            let parameterCount = 0;
            args.parameters.forEach((parameter) => {
                parameterCount++;
                // TODO: Implement parameter operators
                sql += `${parameter.column} = $${parameterCount}`;
            });
            sql += ' AND deleted_at IS NULL';
        }
        return sql;
    }

    buildInsertSQL(): string {
        let sql = `INSERT INTO ${this.table} (`;
        let values = '';
        let valueCount = 0;
        this.columnNames.forEach((columnName) => {
            sql += `${columnName}, `;
            valueCount++;
            values += `$${valueCount}, `;
        });
        sql = sql.substring(0, sql.length - 2);
        values = values.substring(0, values.length - 2);
        sql += `) VALUES (${values})`;
        return sql;
    }

    buildUpdateSQL<TRecord>(args: {
        parameters?: Parameter<TRecord>[];
    }): string {
        let sql = `UPDATE ${this.table} SET `;
        let valueCount = 0;
        this.columnNames.forEach((columnName) => {
            valueCount++;
            sql += `${columnName} = $${valueCount}, `;
        });
        sql = sql.substring(0, sql.length - 2);
        if (args.parameters) {
            sql += ' WHERE ';
            let parameterCount = 0;
            args.parameters.forEach((parameter) => {
                parameterCount++;
                // TODO: Implement parameter operators
                sql += `${parameter.column} = $${parameterCount}`;
            });
        }
        sql += ' AND deleted_at IS NULL';
        return sql;
    }

    // getOne - Returns one record or null, requires *at least* primary key columns as parameters.
    async getOne(args: {
        parameters: Parameter<TRecord>[];
        forUpdate?: boolean;
    }): Promise<TRecord> {
        if (
            // TODO: Parameters contains primary key(s)
            args.parameters.filter((parameter) => parameter.column === 'id')
                .length != 1
        ) {
            // TODO: Data layer exception type
            throw new Error('Missing primary key');
        }
        const client = await this.databaseService.connect();
        const sql = this.buildSelectSQL({
            parameters: args.parameters,
            forUpdate: args.forUpdate,
        });
        const values = args.parameters.map(
            (parameter: Parameter<TRecord>) => parameter.value,
        );
        const result = await client.query(sql, values);
        if (result.rows.length != 1) {
            // TODO: Data layer exception type
            throw new Error('Record does not exist');
        }
        return result.rows[0] as TRecord;
    }

    // getOne - Returns many records or null, optional *any* valid columns as parameters
    async getMany(args: {
        parameters?: Parameter<TRecord>[];
        forUpdate?: boolean;
    }): Promise<TRecord[]> {
        const client = await this.databaseService.connect();
        const sql = this.buildSelectSQL({
            parameters: args.parameters,
            forUpdate: args.forUpdate,
        });
        const values = args.parameters.map(
            (parameter: Parameter<TRecord>) => parameter.value,
        );
        const result = await client.query(sql, values);

        return result.rows as TRecord[];
    }

    // updateOne - Updates one record, returning the updated record. Requires a record with primary key column values set.
    updateOne(args: { record: TRecord }): TRecord {
        // TODO: Implement
        return {} as TRecord;
    }

    // insertOne - Inserts one record, returning the inserted record. Requires a record with primary key column values set.
    insertOne(args: { record: TRecord }): TRecord {
        // TODO: Implement
        return {} as TRecord;
    }

    // deleteOne - Deletes one record, requires *at least* primary key columns as parameters.
    deleteOne(args: { parameters: Parameter<TRecord>[] }): void {
        // TODO: Implement
        return;
    }
}
