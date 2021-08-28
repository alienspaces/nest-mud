import { Injectable } from '@nestjs/common';

// Application
import {
    DungeonCharacterRepository,
    DungeonCharacterRepositoryRecord,
    DungeonLocationRepository,
    DungeonLocationRepositoryRecord,
    DungeonMonsterRepository,
    DungeonMonsterRepositoryRecord,
    DungeonObjectRepository,
    DungeonObjectRepositoryRecord,
    DungeonActionRepository,
    DungeonActionRepositoryRecord,
} from '@/repositories';

import {
    CreateDungeonActionEntity,
    DungeonActionEntity,
} from './dungeon-action.entities';

import {
    DungeonCharacterActionResolver,
    ResolverRecords,
} from './dungeon-action.resolver';
import { RepositoryOperator } from '@/core';
type Action = {
    action: string;
    dungeon_location_id: string;
    dungeon_character_id: string;
    dungeon_object_id: string;
};

@Injectable()
export class DungeonActionService {
    private resolver: DungeonCharacterActionResolver;
    constructor(
        private dungeonCharacterRepository: DungeonCharacterRepository,
        private dungeonLocationRepository: DungeonLocationRepository,
        private dungeonMonsterRepository: DungeonMonsterRepository,
        private dungeonObjectRepository: DungeonObjectRepository,
        private dungeonActionRepository: DungeonActionRepository,
    ) {
        this.resolver = new DungeonCharacterActionResolver();
    }

    async resolveDungeonCharacterAction(
        dungeonCharacterID: string,
        sentence: string,
    ): Promise<CreateDungeonActionEntity> {
        // Character record
        const characterRecord = await this.dungeonCharacterRepository.getOne({
            id: dungeonCharacterID,
        });
        if (!characterRecord) {
            throw new Error(
                `Character ${dungeonCharacterID} not found, cannot create dungeon character action`,
            );
        }

        // Location record
        const locationRecord = await this.dungeonLocationRepository.getOne({
            id: characterRecord.dungeon_location_id,
        });

        // Characters at location
        const characterRecords = await this.dungeonCharacterRepository.getMany({
            parameters: [
                {
                    column: 'dungeon_location_id',
                    value: characterRecord.dungeon_location_id,
                },
            ],
        });

        // Monsters at location
        const monsterRecords = await this.dungeonMonsterRepository.getMany({
            parameters: [
                {
                    column: 'dungeon_location_id',
                    value: characterRecord.dungeon_location_id,
                },
            ],
        });

        // Objects at location
        const objectRecords = await this.dungeonObjectRepository.getMany({
            parameters: [
                {
                    column: 'dungeon_location_id',
                    value: characterRecord.dungeon_location_id,
                },
            ],
        });

        let locationIds: string[] = [];
        [
            'north_dungeon_location_id',
            'northeast_dungeon_location_id',
            'east_dungeon_location_id',
            'southeast_dungeon_location_id',
            'south_dungeon_location_id',
            'southwest_dungeon_location_id',
            'west_dungeon_location_id',
            'northwest_dungeon_location_id',
            'up_dungeon_location_id',
            'down_dungeon_location_id',
        ].forEach((prop) => {
            if (locationRecord[prop]) {
                locationIds.push(locationRecord[prop]);
            }
        });

        // Location records
        const locationRecords = await this.dungeonLocationRepository.getMany({
            parameters: [
                {
                    column: 'id',
                    value: locationIds,
                    operator: RepositoryOperator.In,
                },
            ],
        });

        // Resolve action sentence
        const records: ResolverRecords = {
            character: characterRecord,
            location: locationRecord,
            characters: characterRecords,
            monsters: monsterRecords,
            objects: objectRecords,
            locations: locationRecords,
        };

        const createDungeonActionEntity = this.resolver.resolveAction(
            sentence,
            records,
        );
        if (!createDungeonActionEntity) {
            throw new Error('Failed to resolve action');
        }

        return createDungeonActionEntity;
    }

    async createDungeonCharacterAction(
        createDungeonActionEntity: CreateDungeonActionEntity,
    ): Promise<DungeonActionEntity> {
        let dungeonActionRecord: DungeonActionRepositoryRecord = {
            dungeon_id: createDungeonActionEntity.dungeon_id,
            dungeon_location_id: createDungeonActionEntity.dungeon_location_id,
            dungeon_character_id:
                createDungeonActionEntity.dungeon_character_id,
            dungeon_monster_id: createDungeonActionEntity.dungeon_monster_id,
            resolved_command: createDungeonActionEntity.resolved_command,
            resolved_equipped_dungeon_object_name:
                createDungeonActionEntity.resolved_equipped_dungeon_object_name,
            resolved_equipped_dungeon_object_id:
                createDungeonActionEntity.resolved_equipped_dungeon_object_id,
            resolved_stashed_dungeon_object_name:
                createDungeonActionEntity.resolved_stashed_dungeon_object_name,
            resolved_stashed_dungeon_object_id:
                createDungeonActionEntity.resolved_stashed_dungeon_object_id,
            resolved_target_dungeon_object_name:
                createDungeonActionEntity.resolved_target_dungeon_object_name,
            resolved_target_dungeon_object_id:
                createDungeonActionEntity.resolved_target_dungeon_object_id,
            resolved_target_dungeon_character_name:
                createDungeonActionEntity.resolved_target_dungeon_character_name,
            resolved_target_dungeon_character_id:
                createDungeonActionEntity.resolved_target_dungeon_character_id,
            resolved_target_dungeon_monster_name:
                createDungeonActionEntity.resolved_target_dungeon_monster_name,
            resolved_target_dungeon_monster_id:
                createDungeonActionEntity.resolved_target_dungeon_monster_id,
            resolved_target_dungeon_location_direction:
                createDungeonActionEntity.resolved_target_dungeon_location_direction,
            resolved_target_dungeon_location_name:
                createDungeonActionEntity.resolved_target_dungeon_location_name,
            resolved_target_dungeon_location_id:
                createDungeonActionEntity.resolved_target_dungeon_location_id,
        };

        dungeonActionRecord = await this.dungeonActionRepository.insertOne({
            record: dungeonActionRecord,
        });

        const dungeonActionEntity =
            this.buildDungeonActionEntity(dungeonActionRecord);
        return dungeonActionEntity;
    }

    async performDungeonCharacterAction(
        dungeonActionEntity: DungeonActionEntity,
    ): Promise<DungeonActionEntity> {
        throw new Error('Method not implemented');
    }

    buildDungeonActionEntity(
        dungeonActionRecord: DungeonActionRepositoryRecord,
    ): DungeonActionEntity {
        const dungeonActionEntity: DungeonActionEntity = {
            id: dungeonActionRecord.id,
            dungeon_id: dungeonActionRecord.dungeon_id,
            dungeon_location_id: dungeonActionRecord.dungeon_location_id,
            dungeon_character_id: dungeonActionRecord.dungeon_character_id,
            dungeon_monster_id: dungeonActionRecord.dungeon_monster_id,
            resolved_command: dungeonActionRecord.resolved_command,
            resolved_equipped_dungeon_object_name:
                dungeonActionRecord.resolved_equipped_dungeon_object_name,
            resolved_equipped_dungeon_object_id:
                dungeonActionRecord.resolved_equipped_dungeon_object_id,
            resolved_stashed_dungeon_object_name:
                dungeonActionRecord.resolved_stashed_dungeon_object_name,
            resolved_stashed_dungeon_object_id:
                dungeonActionRecord.resolved_stashed_dungeon_object_id,
            resolved_target_dungeon_object_name:
                dungeonActionRecord.resolved_target_dungeon_object_name,
            resolved_target_dungeon_object_id:
                dungeonActionRecord.resolved_target_dungeon_object_id,
            resolved_target_dungeon_character_name:
                dungeonActionRecord.resolved_target_dungeon_character_name,
            resolved_target_dungeon_character_id:
                dungeonActionRecord.resolved_target_dungeon_character_id,
            resolved_target_dungeon_monster_name:
                dungeonActionRecord.resolved_target_dungeon_monster_name,
            resolved_target_dungeon_monster_id:
                dungeonActionRecord.resolved_target_dungeon_monster_id,
            resolved_target_dungeon_location_direction:
                dungeonActionRecord.resolved_target_dungeon_location_direction,
            resolved_target_dungeon_location_name:
                dungeonActionRecord.resolved_target_dungeon_location_name,
            resolved_target_dungeon_location_id:
                dungeonActionRecord.resolved_target_dungeon_location_id,
            created_at: dungeonActionRecord.created_at,
            updated_at: dungeonActionRecord.updated_at,
        };
        return dungeonActionEntity;
    }
}
