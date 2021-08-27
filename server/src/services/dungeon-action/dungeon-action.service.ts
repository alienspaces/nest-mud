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
export class DungeonCharacterActionService {
    private resolver: DungeonCharacterActionResolver;
    constructor(
        private dungeonCharacterRepository: DungeonCharacterRepository,
        private dungeonLocationRepository: DungeonLocationRepository,
        private dungeonMonsterRepository: DungeonMonsterRepository,
        private dungeonObjectRepository: DungeonObjectRepository,
        private DungeonActionRepository: DungeonActionRepository,
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
        // Create dungeon character action record

        // Update dungeon character record

        throw new Error('Method not implemented');
    }
}
