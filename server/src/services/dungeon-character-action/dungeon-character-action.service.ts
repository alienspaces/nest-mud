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
    DungeonCharacterActionRepository,
    DungeonCharacterActionRepositoryRecord,
} from '@/repositories';

import {
    CreateDungeonCharacterActionEntity,
    DungeonCharacterActionEntity,
} from './dungeon-character-action.entities';

type Action = {
    action: string;
    dungeon_location_id: string;
    dungeon_character_id: string;
    dungeon_object_id: string;
};

@Injectable()
export class DungeonCharacterActionService {
    constructor(
        private dungeonCharacterRepository: DungeonCharacterRepository,
        private dungeonLocationRepository: DungeonLocationRepository,
        private dungeonMonsterRepository: DungeonMonsterRepository,
        private dungeonObjectRepository: DungeonObjectRepository,
        private dungeonCharacterActionRepository: DungeonCharacterActionRepository,
    ) {}

    async createDungeonCharacterAction(
        createDungeonCharacterActionEntity: CreateDungeonCharacterActionEntity,
    ): Promise<DungeonCharacterActionEntity> {
        // Character record
        const characterRecord = await this.dungeonCharacterRepository.getOne({
            id: createDungeonCharacterActionEntity.character_id,
        });
        if (!characterRecord) {
            throw new Error(
                `Character ${createDungeonCharacterActionEntity.character_id} not found, cannot create dungeon character action`,
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

        // Resolve action sentence
        const actionResult = await this.resolveAction(
            createDungeonCharacterActionEntity.action,
            {
                character: characterRecord,
                location: locationRecord,
                characters: characterRecords,
                monsters: monsterRecords,
                objects: objectRecords,
            },
        );

        // Create dungeon character action record

        // Update dungeon character record

        throw new Error('Method not implemented');
    }

    async resolveAction(
        action: string,
        records: {
            character: DungeonCharacterRepositoryRecord;
            location: DungeonLocationRepositoryRecord;
            characters: DungeonCharacterRepositoryRecord[];
            monsters: DungeonMonsterRepositoryRecord[];
            objects: DungeonObjectRepositoryRecord[];
        },
    ): Promise<Action> {
        const words = action.split(' ');
        if (words.length < 2) {
            throw new Error('Not enough words for an action');
        }
        switch (words[0]) {
            case 'move':
                //
                break;
            case 'look':
                //
                break;
            case 'equip':
                //
                break;
            case 'stash':
                //
                break;
            case 'drop':
                //
                break;
        }
        return null;
    }
}
