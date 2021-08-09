import { Injectable } from '@nestjs/common';

// Application
import { Repository, ColumnConfig } from './repository';
import { DatabaseService } from '@/core';

export interface TestRecord {
    id?: string;
    name: string;
    age?: number;
}

@Injectable()
export class TestRepository extends Repository<TestRecord> {
    constructor(databaseService: DatabaseService) {
        super(databaseService, 'test', [
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
        ] as ColumnConfig[]);
    }
}