import * as crypto from 'crypto';

// Application
import { DatabaseService, LoggerService } from '@/core';

export interface ColumnConfig {
    name: string;
    isPrimary: boolean;
    isNullable: boolean;
}

// Repository requires that record types extend the Record interface
export interface Record {
    id?: string;
    created_at?: Date;
    updated_at?: Date | null;
    deleted_at?: Date | null;
}

export enum RepositoryOperator {
    Equal,
    NotEqual,
    LessThan,
    GreaterThan,
    LessThanEqual,
    GreaterThanEqual,
}

export interface RepositoryParameter<T> {
    column: keyof T;
    value: any;
    operator?: RepositoryOperator;
}

export abstract class Repository<TRecord extends Record> {
    table: string;
    columns: any;
    private primaryColumnNames: string[];
    private columnNames: string[];

    constructor(
        private databaseService: DatabaseService,
        private loggerService: LoggerService,
        table: string,
        columns: ColumnConfig[],
    ) {
        this.databaseService = databaseService;
        this.table = table;
        this.columns = columns;
        this.columnNames = this.columns.map(
            (column: ColumnConfig) => column.name as keyof TRecord,
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
        parameters?: RepositoryParameter<TRecord>[];
        forUpdate?: boolean;
        offset?: number;
        limit?: number;
    }): string {
        const logger = this.loggerService.logger({
            function: 'buildSelectSQL',
        });

        let sql = `SELECT `;
        this.columnNames.forEach((columnName) => {
            sql += `${columnName}, `;
        });
        sql = sql.substring(0, sql.length - 2);
        sql += ` FROM ${this.table}`;
        sql += ' WHERE ';
        if (args.parameters.length) {
            let parameterCount = 0;
            args.parameters.forEach((parameter) => {
                parameterCount++;
                // TODO: Implement parameter operators
                sql += `${parameter.column} = $${parameterCount}`;
            });
            sql += ' AND ';
        }
        sql += 'deleted_at IS NULL';
        logger.info(sql);
        return sql;
    }

    buildInsertSQL(): string {
        const logger = this.loggerService.logger({
            function: 'buildInsertSQL',
        });
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
        sql += ' RETURNING ';
        this.columnNames.forEach((columnName) => {
            valueCount++;
            sql += `${columnName}, `;
        });
        sql = sql.substring(0, sql.length - 2);
        logger.info(sql);
        return sql;
    }

    buildUpdateSQL<TRecord>(args: {
        parameters?: RepositoryParameter<TRecord>[];
    }): string {
        const logger = this.loggerService.logger({
            function: 'buildUpdateSQL',
        });
        let sql = `UPDATE ${this.table} SET `;
        let valueCount = 0;
        this.columnNames.forEach((columnName) => {
            valueCount++;
            sql += `${columnName} = $${valueCount}, `;
        });
        sql = sql.substring(0, sql.length - 2);
        sql += ' WHERE ';
        if (args.parameters.length) {
            let parameterCount = 0;
            args.parameters.forEach((parameter) => {
                parameterCount++;
                // TODO: Implement parameter operators
                sql += `${parameter.column} = $${parameterCount}`;
            });
            sql += ' AND ';
        }
        sql += 'deleted_at IS NULL RETURNING ';
        this.columnNames.forEach((columnName) => {
            valueCount++;
            sql += `${columnName}, `;
        });
        sql = sql.substring(0, sql.length - 2);
        logger.info(sql);
        return sql;
    }

    // getOne - Returns one record or null, requires *at least* primary key columns as parameters.
    async getOne(args: {
        parameters: RepositoryParameter<TRecord>[];
        forUpdate?: boolean;
    }): Promise<TRecord> {
        if (
            // TODO: RepositoryParameters contains primary key(s)
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
            (parameter: RepositoryParameter<TRecord>) => parameter.value,
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
        parameters?: RepositoryParameter<TRecord>[];
        forUpdate?: boolean;
    }): Promise<TRecord[]> {
        const client = await this.databaseService.connect();
        const sql = this.buildSelectSQL({
            parameters: args.parameters,
            forUpdate: args.forUpdate,
        });
        const values = args.parameters.map(
            (parameter: RepositoryParameter<TRecord>) => parameter.value,
        );
        const result = await client.query(sql, values);

        return result.rows as TRecord[];
    }

    // updateOne - Updates one record, returning the updated record. Requires a record with primary key column values set.
    async updateOne(args: { record: TRecord }): Promise<TRecord> {
        const client = await this.databaseService.connect();
        const parameters = this.primaryColumnNames.map((primaryColumnName) => {
            return {
                column: primaryColumnName,
                value: args.record[primaryColumnName],
                operator: RepositoryOperator.Equal,
            };
        });
        const sql = this.buildUpdateSQL({
            parameters: parameters,
        });

        args.record.updated_at = new Date(new Date().toUTCString());

        const values = this.columnNames.map(
            (columnName: string) => args.record[columnName],
        );
        const result = await client.query(sql, values);
        if (result.rows.length != 1) {
            // TODO: Data layer exception type
            throw new Error('Failed returning record from update');
        }
        return result.rows[0] as TRecord;
    }

    // insertOne - Inserts one record, returning the inserted record. Requires a record with primary key column values set.
    async insertOne(args: { record: TRecord }): Promise<TRecord> {
        const client = await this.databaseService.connect();

        // TODO: Only include non null record properties in insert SQL column list and values

        const sql = this.buildInsertSQL();

        if (!args.record.id) {
            args.record.id = crypto.randomUUID();
        }
        args.record.created_at = new Date(new Date().toUTCString());

        const values = this.columnNames.map(
            (columnName: string) => args.record[columnName],
        );
        const result = await client.query(sql, values);
        if (result.rows.length != 1) {
            // TODO: Data layer exception type
            throw new Error('Failed returning record from insert');
        }
        return result.rows[0] as TRecord;
    }

    // deleteOne - Deletes one record, requires *at least* primary key columns as parameters.
    deleteOne(args: { parameters: RepositoryParameter<TRecord>[] }): void {
        // TODO: Implement
        return;
    }
}
