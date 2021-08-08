import { timeStamp } from 'console';

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

export interface Parameter {
    column: string;
    value: any;
    operator: Operator;
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
    primaryColumnNames: string[];
    columnNames: string[];

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

        console.log('Primary column names');
        console.log(this.primaryColumnNames);

        console.log('All column names');
        console.log(this.columnNames);
    }

    buildSelectSQL(args: {
        parameters: Parameter[];
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

    buildUpdateSQL(args: { parameters: Parameter[] }): string {
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
                sql += `${parameter.column} = $${parameterCount}`;
            });
        }
        sql += ' AND deleted_at IS NULL';
        return sql;
    }

    // getOne - Returns one or null records, requires *only* primary key column names as parameters.
    getOne(args: { parameters: Parameter[] }): TRecord {
        // TODO: Implement
        return {} as TRecord;
    }

    // getOne - Returns many or null records, allows *any* valid column names as parameters
    getMany(args: { parameters: Parameter[] }): TRecord[] {
        // TODO: Implement
        return [] as TRecord[];
    }

    // updateOne - Updates 1 record, returning the updated record. Requires a record with primary key column values set.
    updateOne(args: { record: TRecord }): TRecord {
        // TODO: Implement
        return {} as TRecord;
    }

    // insertOne - Inserts 1 record, returning the inserted record. Requires a record with primary key column values set.
    insertOne(args: { record: TRecord }): TRecord {
        // TODO: Implement
        return {} as TRecord;
    }

    // deleteOne - Deletes 1 record, requires *only* primary key column names as parameters.
    deleteOne(args: { parameters: Parameter[] }): void {
        // TODO: Implement
        return;
    }
}
