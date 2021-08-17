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

export interface DungeonObjectRepositoryRecord {
    id?: string;
    dungeon_id: string;
    dungeon_location_id: string;
    name: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export interface DungeonObjectRepositoryParameter
    extends RepositoryParameter<DungeonObjectRepositoryRecord> {}

@Injectable()
export class DungeonObjectRepository extends Repository<DungeonObjectRepositoryRecord> {
    constructor(
        databaseService: DatabaseService,
        loggerService: LoggerService,
    ) {
        super(databaseService, loggerService, 'dungeon_object', [
            {
                name: 'id',
                isPrimary: true,
                isNullable: false,
            },
            {
                name: 'dungeon_id',
                isPrimary: false,
                isNullable: false,
            },
            {
                name: 'dungeon_location_id',
                isPrimary: false,
                isNullable: false,
            },
            {
                name: 'name',
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
