import * as crypto from 'crypto';
import { QueryResult } from 'pg';

// Application
import { DatabaseService, LoggerService } from '@/core';
import { RepositoryError } from '@/core/error/error';

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
    In,
    Between,
}

export enum RepositoryOrder {
    Ascending,
    Descending,
}

export interface RepositoryParameter<T> {
    column: RepositoryColumn<T>;
    value: any | any[];
    operator?: RepositoryOperator;
}

export type RepositoryColumn<T> = Extract<keyof T, string>;

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
        this.columnNames = this.columns.map((column: ColumnConfig) => column.name as keyof TRecord);
        this.primaryColumnNames = this.columns.reduce((primaryColumnNames: string[], column: ColumnConfig) => {
            column.isPrimary ? primaryColumnNames.push(column.name) : null;
            return primaryColumnNames;
        }, []);
    }

    buildSelectSQL<TRecord>(args: {
        parameters?: RepositoryParameter<TRecord>[];
        forUpdate?: boolean;
        orderByColumn?: string;
        orderByDirection?: RepositoryOrder;
        offset?: number;
        limit?: number;
    }): string {
        const logger = this.loggerService.logger({
            function: 'buildSelectSQL',
        });

        let sql = `SELECT `;
        this.columnNames.forEach((columnName) => {
            sql += `"${columnName}", `;
        });
        sql = sql.substring(0, sql.length - 2);
        sql += ` FROM ${this.table} `;
        sql += 'WHERE ';
        if (args.parameters.length) {
            let parameterCount = 0;
            let placeholderCount = 0;
            args.parameters.forEach((parameter) => {
                parameterCount++;
                if (parameter.operator === RepositoryOperator.In && Array.isArray(parameter.value)) {
                    sql += `"${parameter.column}" IN (`;
                    parameter.value.forEach((value) => {
                        sql += `$${++placeholderCount}, `;
                    });
                    sql = sql.substring(0, sql.length - 2);
                    sql += ') ';
                } else if (parameter.operator === RepositoryOperator.Between && Array.isArray(parameter.value)) {
                    sql += `"${parameter.column}" BETWEEN $${++placeholderCount} AND $${++placeholderCount}`;
                } else if (parameter.operator == RepositoryOperator.LessThan) {
                    sql += `"${parameter.column}" < $${++placeholderCount}`;
                } else if (parameter.operator == RepositoryOperator.LessThanEqual) {
                    sql += `"${parameter.column}" <+ $${++placeholderCount}`;
                } else if (parameter.operator == RepositoryOperator.GreaterThan) {
                    sql += `"${parameter.column}" > $${++placeholderCount}`;
                } else if (parameter.operator == RepositoryOperator.GreaterThanEqual) {
                    sql += `"${parameter.column}" >= $${++placeholderCount}`;
                } else {
                    sql += `"${parameter.column}" = $${++placeholderCount}`;
                }
                if (parameterCount <= args.parameters.length) {
                    sql += ' AND ';
                }
            });
        }
        sql += '"deleted_at" IS NULL';

        if (args.orderByColumn) {
            const orderByDirection = args.orderByDirection || RepositoryOrder.Ascending;
            sql += ` ORDER BY "${args.orderByColumn}" ${
                orderByDirection == RepositoryOrder.Ascending ? 'ASC' : 'DESC'
            }`;
        }

        if (args.limit) {
            sql += ` LIMIT ${args.limit}`;
        }

        if (args.forUpdate) {
            sql += ' FOR UPDATE';
        }

        logger.info(sql);
        return sql;
    }

    buildInsertSQL(record: TRecord): string {
        const logger = this.loggerService.logger({
            function: 'buildInsertSQL',
        });
        let sql = `INSERT INTO ${this.table} (`;
        let values = '';
        let valueCount = 0;
        this.columnNames.forEach((columnName) => {
            logger.debug(`Column ${columnName} value ${record[columnName]}`);
            if (record[columnName] !== undefined) {
                sql += `"${columnName}", `;
                valueCount++;
                values += `$${valueCount}, `;
            }
        });
        sql = sql.substring(0, sql.length - 2);
        values = values.substring(0, values.length - 2);
        sql += `) VALUES (${values})`;
        sql += ' RETURNING ';
        this.columnNames.forEach((columnName) => {
            sql += `"${columnName}", `;
        });
        sql = sql.substring(0, sql.length - 2);
        logger.debug(sql);
        return sql;
    }

    buildUpdateSQL<TRecord>(args: { parameters?: RepositoryParameter<TRecord>[] }): string {
        const logger = this.loggerService.logger({
            function: 'buildUpdateSQL',
        });
        let sql = `UPDATE ${this.table} SET `;
        let valueCount = 0;
        this.columnNames.forEach((columnName) => {
            valueCount++;
            sql += `"${columnName}" = $${valueCount}, `;
        });
        sql = sql.substring(0, sql.length - 2);
        sql += ' WHERE ';
        if (args.parameters.length) {
            let parameterCount = 0;
            args.parameters.forEach((parameter) => {
                parameterCount++;
                sql += `"${parameter.column}" = $${parameterCount}`;
            });
            sql += ' AND ';
        }
        sql += '"deleted_at" IS NULL RETURNING ';
        this.columnNames.forEach((columnName) => {
            sql += `"${columnName}", `;
        });
        sql = sql.substring(0, sql.length - 2);
        logger.debug(sql);
        return sql;
    }

    buildDeleteSQL<TRecord>(args: { parameters?: RepositoryParameter<TRecord>[] }): string {
        const logger = this.loggerService.logger({
            function: 'buildDeleteSQL',
        });

        let sql = `UPDATE ${this.table} SET "deleted_at" = NOW() WHERE `;
        if (args.parameters.length) {
            let parameterCount = 0;
            args.parameters.forEach((parameter) => {
                parameterCount++;
                sql += `"${parameter.column}" = $${parameterCount}`;
            });
            sql += ' AND ';
        }
        sql += '"deleted_at" IS NULL RETURNING ';
        this.columnNames.forEach((columnName) => {
            sql += `"${columnName}", `;
        });
        sql = sql.substring(0, sql.length - 2);
        logger.debug(sql);
        return sql;
    }

    // getOne - Returns one record or null, requires *at least* primary key columns as parameters.
    async getOne(args: { id: string; forUpdate?: boolean }): Promise<TRecord> {
        const logger = this.loggerService.logger({
            function: 'getOne',
        });
        const client = this.databaseService.client;
        const sql = this.buildSelectSQL({
            parameters: [
                {
                    column: 'id',
                    value: args.id,
                },
            ],
            forUpdate: args.forUpdate,
        });
        const values = [args.id];
        logger.debug(values);
        let result: QueryResult<any>;
        try {
            result = await client.query(sql, values);
        } catch (error) {
            throw new RepositoryError(error);
        }
        if (result.rows.length != 1) {
            throw new RepositoryError('Record does not exist');
        }
        return result.rows[0] as TRecord;
    }

    // getMany - Returns many records or null, optional *any* valid columns as parameters
    async getMany(args: {
        parameters?: RepositoryParameter<TRecord>[];
        forUpdate?: boolean;
        orderByColumn?: RepositoryColumn<TRecord>;
        orderByDirection?: RepositoryOrder;
        limit?: number;
    }): Promise<TRecord[]> {
        const logger = this.loggerService.logger({
            function: 'getMany',
        });
        const client = this.databaseService.client;
        const sql = this.buildSelectSQL({
            parameters: args.parameters,
            forUpdate: args.forUpdate,
            orderByColumn: args.orderByColumn,
            orderByDirection: args.orderByDirection,
            limit: args.limit,
        });
        let values: any[] = [];
        args.parameters.forEach((parameter: RepositoryParameter<TRecord>) => {
            if (Array.isArray(parameter.value)) {
                parameter.value.forEach((value) => {
                    values.push(value);
                });
            } else {
                values.push(parameter.value);
            }
        });
        logger.info(values);

        let result: QueryResult<any>;
        try {
            result = await client.query(sql, values);
        } catch (error) {
            throw new RepositoryError(error);
        }

        return result.rows as TRecord[];
    }

    // updateOne - Updates one record, returning the updated record. Requires a record with primary key column values set.
    async updateOne(args: { record: TRecord }): Promise<TRecord> {
        const logger = this.loggerService.logger({
            function: 'updateOne',
        });
        const client = this.databaseService.client;
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

        const values = this.columnNames.map((columnName: string) => args.record[columnName]);
        logger.debug(values);

        let result: QueryResult<any>;
        try {
            result = await client.query(sql, values);
        } catch (error) {
            throw new RepositoryError(error);
        }

        if (result.rowCount != 1) {
            throw new RepositoryError('Failed returning record from update');
        }
        return result.rows[0] as TRecord;
    }

    // insertOne - Inserts one record, returning the inserted record. Requires a record with primary key column values set.
    async insertOne(args: { record: TRecord }): Promise<TRecord> {
        const logger = this.loggerService.logger({
            function: 'insertOne',
        });
        const client = this.databaseService.client;

        if (!args.record.id) {
            args.record.id = crypto.randomUUID();
        }
        args.record.created_at = new Date(new Date().toUTCString());

        const sql = this.buildInsertSQL(args.record);

        const values: any[] = [];
        this.columnNames.forEach((columnName) => {
            if (args.record[columnName] !== undefined) {
                values.push(args.record[columnName]);
            }
        });

        logger.debug(values);

        let result: QueryResult<any>;
        try {
            result = await client.query(sql, values);
        } catch (error) {
            throw new RepositoryError(error);
        }

        if (result.rows.length != 1) {
            throw new RepositoryError('Failed returning record from insert');
        }
        return result.rows[0] as TRecord;
    }

    // deleteOne - Deletes one record, requires *at least* primary key columns as parameters.
    async deleteOne(args: { id: string }): Promise<void> {
        const logger = this.loggerService.logger({
            function: 'deleteOne',
        });
        const client = this.databaseService.client;
        const parameters = [
            {
                column: 'id',
                value: args.id,
            },
        ];
        const sql = this.buildDeleteSQL({
            parameters: parameters,
        });

        const values = [args.id];
        logger.debug(values);

        let result: QueryResult<any>;
        try {
            result = await client.query(sql, values);
        } catch (error) {
            throw new RepositoryError(error);
        }

        if (result.rowCount != 1) {
            throw new RepositoryError('Failed deleting row');
        }
        return;
    }
}
