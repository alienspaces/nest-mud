/*
 * This file was generated by a tool.
 * Rerun ./script/db-repositories.mjs to regenerate this file.
 */
import { Injectable } from '@nestjs/common';

// Application
import { DatabaseService, Repository, ColumnConfig } from '@/core';

export interface Character {
    id?: string;
    location_id: string;
    name: string;
    strength?: number;
    dexterity?: number;
    intelligence?: number;
    coin?: number;
    experience?: number;
    created_at?: Date;
    updated_at: Date | null;
    deleted_at: Date | null;
}

@Injectable()
export class CharacterRepository extends Repository<Character> {
    constructor(databaseService: DatabaseService) {
        super(databaseService, 'character', [
            {
                name: 'id',
                isPrimary: true,
                isNullable: false,
            },
            {
                name: 'location_id',
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
                name: 'coin',
                isPrimary: false,
                isNullable: false,
            },
            {
                name: 'experience',
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