/*
 * This file was generated by a tool.
 * Rerun ./script/db-repositories.mjs to regenerate this file.
 */
import { Injectable } from '@nestjs/common';

// Application
import { DatabaseService, Repository, ColumnConfig } from '@/core';

export interface LocationRecord {
    id?: string;
    name: string;
    description: string;
    default?: boolean;
    north?: boolean;
    northeast?: boolean;
    east?: boolean;
    southeast?: boolean;
    south?: boolean;
    southwest?: boolean;
    west?: boolean;
    northwest?: boolean;
    up?: boolean;
    down?: boolean;
    created_at?: Date;
    updated_at?: Date | null;
    deleted_at?: Date | null;
}

@Injectable()
export class LocationRepository extends Repository<LocationRecord> {
    constructor(databaseService: DatabaseService) {
        super(databaseService, 'location', [
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
                name: 'default',
                isPrimary: false,
                isNullable: false,
            },
            {
                name: 'north',
                isPrimary: false,
                isNullable: false,
            },
            {
                name: 'northeast',
                isPrimary: false,
                isNullable: false,
            },
            {
                name: 'east',
                isPrimary: false,
                isNullable: false,
            },
            {
                name: 'southeast',
                isPrimary: false,
                isNullable: false,
            },
            {
                name: 'south',
                isPrimary: false,
                isNullable: false,
            },
            {
                name: 'southwest',
                isPrimary: false,
                isNullable: false,
            },
            {
                name: 'west',
                isPrimary: false,
                isNullable: false,
            },
            {
                name: 'northwest',
                isPrimary: false,
                isNullable: false,
            },
            {
                name: 'up',
                isPrimary: false,
                isNullable: false,
            },
            {
                name: 'down',
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
