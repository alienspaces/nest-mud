import { Injectable } from '@nestjs/common';

// Application
import { Repository, ColumnConfig } from './repository';
import { DatabaseService, LoggerService } from '@/core';

export interface TestRecord {
    id?: string;
    name: string;
    age?: number;
    created_at?: Date;
    updated_at?: Date | null;
    deleted_at?: Date | null;
}

@Injectable()
export class TestRepository extends Repository<TestRecord> {
    constructor(databaseService: DatabaseService, loggerService: LoggerService) {
        super(databaseService, loggerService, 'test', [
            {
                name: 'id',
                isPrimary: true,
                isNullable: false,
            },
            {
                name: 'name',
                isPrimary: false,
                isNullable: false,
            },
            {
                name: 'age',
                isPrimary: false,
                isNullable: true,
            },
            {
                name: 'created_at',
                isPrimary: false,
                isNullable: false,
            },
            {
                name: 'updated_at',
                isPrimary: false,
                isNullable: true,
            },
            {
                name: 'deleted_at',
                isPrimary: false,
                isNullable: true,
            },
        ] as ColumnConfig[]);
    }
}
