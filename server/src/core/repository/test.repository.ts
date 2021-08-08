import { Injectable } from '@nestjs/common';

// Application
import { Repository, ColumnConfig } from './repository';
import { DatabaseService } from '@/core';

interface Test {
    id?: string;
    name: string;
    age?: number;
}

@Injectable()
export class TestRepository extends Repository<Test> {
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
