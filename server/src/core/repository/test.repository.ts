import { Injectable } from '@nestjs/common';

// Application
import { Repository, ColumnConfig } from './repository';
import { DatabaseService } from '@/core';

export interface TestRecord {
    id?: string;
    name: string;
    age?: number;
    created_at?: Date;
    updated_at?: Date | null;
    deleted_at?: Date | null;
}

const columnConfig = [
    {
        name: 'id',
        type: 'string',
        isPrimary: true,
        isNullable: false,
    },
    {
        name: 'name',
        type: 'string',
        isPrimary: false,
        isNullable: false,
    },
    {
        name: 'age',
        type: 'number',
        isPrimary: false,
        isNullable: true,
    },
    {
        name: 'created_at',
        type: 'Date',
        isPrimary: false,
        isNullable: false,
    },
    {
        name: 'updated_at',
        type: 'Date',
        isPrimary: false,
        isNullable: true,
    },
    {
        name: 'deleted_at',
        type: 'Date',
        isPrimary: false,
        isNullable: true,
    },
];

@Injectable()
export class TestRepository extends Repository<TestRecord> {
    constructor(databaseService: DatabaseService) {
        super(databaseService, 'test', columnConfig);
    }
}
