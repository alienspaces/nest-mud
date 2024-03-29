/*
 * This file was generated by a tool.
 * Rerun ./script/db-repositories.mjs to regenerate this file.
 */
import { Injectable } from '@nestjs/common';

// Application
import { DatabaseService, LoggerService, Repository, RepositoryParameter, ColumnConfig } from '@/core';

export interface DungeonCharacterRepositoryRecord {
    id?: string;
    dungeon_id: string;
    dungeon_location_id: string;
    name: string;
    strength?: number;
    dexterity?: number;
    intelligence?: number;
    health?: number;
    fatigue?: number;
    coins?: number;
    experience_points?: number;
    attribute_points?: number;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export interface DungeonCharacterRepositoryParameter
    extends RepositoryParameter<DungeonCharacterRepositoryRecord> {}

@Injectable()
export class DungeonCharacterRepository extends Repository<DungeonCharacterRepositoryRecord> {
    constructor(
        databaseService: DatabaseService,
        loggerService: LoggerService,
    ) {
        super(databaseService, loggerService, 'dungeon_character', [
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
                name: 'strength',
                isPrimary: false,
                isNullable: false,
            },
            {
                name: 'dexterity',
                isPrimary: false,
                isNullable: false,
            },
            {
                name: 'intelligence',
                isPrimary: false,
                isNullable: false,
            },
            {
                name: 'health',
                isPrimary: false,
                isNullable: false,
            },
            {
                name: 'fatigue',
                isPrimary: false,
                isNullable: false,
            },
            {
                name: 'coins',
                isPrimary: false,
                isNullable: false,
            },
            {
                name: 'experience_points',
                isPrimary: false,
                isNullable: false,
            },
            {
                name: 'attribute_points',
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
