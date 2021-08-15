/*
 * This file was generated by a tool.
 * Rerun ./script/db-repositories.mjs to regenerate this file.
 */
import { Injectable } from '@nestjs/common';

// Application
import {
    DatabaseService,
    LoggerService,
    Repository,
    RepositoryParameter,
    ColumnConfig,
} from '@/core';

export interface DungeonRepositoryRecord {
    id?: string;
    name: string;
    description: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export interface DungeonRepositoryParameter
    extends RepositoryParameter<DungeonRepositoryRecord> {}

@Injectable()
export class DungeonRepository extends Repository<DungeonRepositoryRecord> {
    constructor(
        databaseService: DatabaseService,
        loggerService: LoggerService,
    ) {
        super(databaseService, loggerService, 'dungeon', [
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
                name: 'description',
                isPrimary: false,
                isNullable: false,
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
