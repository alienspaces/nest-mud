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

export class Repository {
    table: string;
    record: any;
    constructor(table: string, record: any) {
        this.table = table;
        this.record = record;
    }

    buildSelectSQL(args: {
        parameters: Parameter[];
        forUpdate?: boolean;
        offset?: number;
        limit?: number;
    }): string {
        let sql = `SELECT `;
        for (let prop in this.record) {
            sql += `${prop}, `;
        }
        sql = sql.substring(0, sql.length - 2);
        sql += ` FROM ${this.table}`;
        if (args.parameters) {
            sql += ' WHERE ';
            let parameterCount = 0;
            args.parameters.forEach((parameter) => {
                parameterCount++;
                sql += `${parameter.column} = $${parameterCount}`;
            });
        }
        return sql;
    }

    buildInsertSQL(): string {
        let sql = `INSERT INTO ${this.table} (`;
        let values = '';
        let valueCount = 0;
        for (let prop in this.record) {
            sql += `${prop}, `;
            valueCount++;
            values += `$${valueCount}, `;
        }
        sql = sql.substring(0, sql.length - 2);
        values = values.substring(0, values.length - 2);
        sql += `) VALUES (${values})`;
        return sql;
    }

    buildUpdateSQL(args: { parameters: Parameter[] }): string {
        let sql = `UPDATE ${this.table} SET `;
        let valueCount = 0;
        for (let prop in this.record) {
            valueCount++;
            sql += `${prop} = $${valueCount}, `;
        }
        sql = sql.substring(0, sql.length - 2);
        if (args.parameters) {
            sql += ' WHERE ';
            let parameterCount = 0;
            args.parameters.forEach((parameter) => {
                parameterCount++;
                sql += `${parameter.column} = $${parameterCount}`;
            });
        }
        return sql;
    }
}
