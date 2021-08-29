/*
 * This file was generated by a tool.
 * Rerun ./script/db-repositories.mjs to regenerate this file.
 */
import { Injectable } from '@nestjs/common';

// Application
import { DatabaseService, LoggerService, Repository, RepositoryParameter, ColumnConfig } from '@/core';

export interface DungeonActionMonsterRepositoryRecord {
    id?: string;
    dungeon_action_id: string;
    dungeon_monster_id: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export interface DungeonActionMonsterRepositoryParameter
    extends RepositoryParameter<DungeonActionMonsterRepositoryRecord> {}

@Injectable()
export class DungeonActionMonsterRepository extends Repository<DungeonActionMonsterRepositoryRecord> {
    constructor(
        databaseService: DatabaseService,
        loggerService: LoggerService,
    ) {
        super(databaseService, loggerService, 'dungeon_action_monster', [
            {
                name: 'id',
                isPrimary: true,
                isNullable: false,
            },
            {
                name: 'dungeon_action_id',
                isPrimary: false,
                isNullable: false,
            },
            {
                name: 'dungeon_monster_id',
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