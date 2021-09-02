import { Injectable } from '@nestjs/common';

// Application
import { LoggerService, RepositoryOperator, RepositoryOrder } from '@/core';
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
import { CreateDungeonActionEntity, DungeonActionEntitySet, DungeonActionEntity } from './dungeon-action.entities';
import { DungeonCharacterActionResolver } from './dungeon-action.resolver';
import { DungeonActionProcessRecordSet, DungeonActionRecordSet } from './dungeon-action.types';

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
        private loggerService: LoggerService,
        private dungeonCharacterRepository: DungeonCharacterRepository,
        private dungeonLocationRepository: DungeonLocationRepository,
        private dungeonMonsterRepository: DungeonMonsterRepository,
        private dungeonObjectRepository: DungeonObjectRepository,
        private dungeonActionRepository: DungeonActionRepository,
    ) {
        this.resolver = new DungeonCharacterActionResolver();
    }

    async processDungeonCharacterAction(dungeonCharacterID: string, sentence: string): Promise<DungeonActionEntity> {
        // Current dungeon character location records
        let records = await this.getDungeonActionProcessRecords(dungeonCharacterID);

        // Resolve character action
        const createDungeonActionEntity = this.resolver.resolveAction(sentence, records);
        if (!createDungeonActionEntity) {
            throw new Error('Failed to resolve action');
        }

        // Create dungeon character action
        const dungeonActionEntity = await this.createDungeonCharacterAction(createDungeonActionEntity);

        // Perform dungeon character action
        await this.performDungeonCharacterAction(dungeonActionEntity, records);

        return dungeonActionEntity;
    }

    async getDungeonActionProcessRecords(dungeonCharacterID: string): Promise<DungeonActionProcessRecordSet> {
        // Character record
        const characterRecord = await this.dungeonCharacterRepository.getOne({
            id: dungeonCharacterID,
            forUpdate: true,
        });
        if (!characterRecord) {
            throw new Error(`Character ${dungeonCharacterID} not found, cannot create dungeon character action`);
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
            forUpdate: true,
        });

        // Monsters at location
        const monsterRecords = await this.dungeonMonsterRepository.getMany({
            parameters: [
                {
                    column: 'dungeon_location_id',
                    value: characterRecord.dungeon_location_id,
                },
            ],
            forUpdate: true,
        });

        // Objects at location
        const objectRecords = await this.dungeonObjectRepository.getMany({
            parameters: [
                {
                    column: 'dungeon_location_id',
                    value: characterRecord.dungeon_location_id,
                },
            ],
            forUpdate: true,
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
        const records: DungeonActionProcessRecordSet = {
            character: characterRecord,
            location: locationRecord,
            characters: characterRecords,
            monsters: monsterRecords,
            objects: objectRecords,
            locations: locationRecords,
        };

        return records;
    }

    async createDungeonCharacterAction(
        createDungeonActionEntity: CreateDungeonActionEntity,
    ): Promise<DungeonActionEntity> {
        let dungeonActionRecord: DungeonActionRepositoryRecord = {
            dungeon_id: createDungeonActionEntity.dungeon_id,
            dungeon_location_id: createDungeonActionEntity.dungeon_location_id,
            dungeon_character_id: createDungeonActionEntity.dungeon_character_id,
            dungeon_monster_id: createDungeonActionEntity.dungeon_monster_id,
            resolved_command: createDungeonActionEntity.resolved_command,
            resolved_equipped_dungeon_object_name: createDungeonActionEntity.resolved_equipped_dungeon_object_name,
            resolved_equipped_dungeon_object_id: createDungeonActionEntity.resolved_equipped_dungeon_object_id,
            resolved_stashed_dungeon_object_name: createDungeonActionEntity.resolved_stashed_dungeon_object_name,
            resolved_stashed_dungeon_object_id: createDungeonActionEntity.resolved_stashed_dungeon_object_id,
            resolved_target_dungeon_object_name: createDungeonActionEntity.resolved_target_dungeon_object_name,
            resolved_target_dungeon_object_id: createDungeonActionEntity.resolved_target_dungeon_object_id,
            resolved_target_dungeon_character_name: createDungeonActionEntity.resolved_target_dungeon_character_name,
            resolved_target_dungeon_character_id: createDungeonActionEntity.resolved_target_dungeon_character_id,
            resolved_target_dungeon_monster_name: createDungeonActionEntity.resolved_target_dungeon_monster_name,
            resolved_target_dungeon_monster_id: createDungeonActionEntity.resolved_target_dungeon_monster_id,
            resolved_target_dungeon_location_direction:
                createDungeonActionEntity.resolved_target_dungeon_location_direction,
            resolved_target_dungeon_location_name: createDungeonActionEntity.resolved_target_dungeon_location_name,
            resolved_target_dungeon_location_id: createDungeonActionEntity.resolved_target_dungeon_location_id,
        };

        dungeonActionRecord = await this.dungeonActionRepository.insertOne({
            record: dungeonActionRecord,
        });

        return this.buildDungeonActionEntity(dungeonActionRecord);
    }

    async performDungeonCharacterAction(
        dungeonActionEntity: DungeonActionEntity,
        records: DungeonActionProcessRecordSet,
    ): Promise<void> {
        const actionFuncs = {
            move: this.performDungeonActionMove,
            look: this.performDungeonActionLook,
            equip: this.performDungeonActionEquip,
            stash: this.performDungeonActionStash,
            drop: this.performDungeonActionDrop,
        };

        return await actionFuncs[dungeonActionEntity.resolved_command](dungeonActionEntity, records);
    }

    async performDungeonActionMove(
        dungeonActionEntity: DungeonActionEntity,
        records: DungeonActionProcessRecordSet,
    ): Promise<void> {
        if (dungeonActionEntity.dungeon_character_id) {
            // Move character
            let characterRecord = records.character;
            characterRecord.dungeon_location_id = dungeonActionEntity.resolved_target_dungeon_location_id;
            characterRecord = await this.dungeonCharacterRepository.updateOne({ record: characterRecord });
        } else if (dungeonActionEntity.dungeon_monster_id) {
            // TODO: Move monster
        }
        return;
    }

    async performDungeonActionLook(
        dungeonActionEntity: DungeonActionEntity,
        records: DungeonActionProcessRecordSet,
    ): Promise<void> {
        throw new Error('Method not implemented');
    }

    async performDungeonActionEquip(
        dungeonActionEntity: DungeonActionEntity,
        records: DungeonActionProcessRecordSet,
    ): Promise<void> {
        throw new Error('Method not implemented');
    }

    async performDungeonActionStash(
        dungeonActionEntity: DungeonActionEntity,
        records: DungeonActionProcessRecordSet,
    ): Promise<void> {
        throw new Error('Method not implemented');
    }

    async performDungeonActionDrop(
        dungeonActionEntity: DungeonActionEntity,
        records: DungeonActionProcessRecordSet,
    ): Promise<void> {
        throw new Error('Method not implemented');
    }

    async getPreviousCharacterDungeonActionEntitySets(
        dungeonActionEntity: DungeonActionEntity,
    ): Promise<DungeonActionEntitySet[]> {
        const logger = this.loggerService.logger({
            function: 'getPreviousCharacterDungeonActionEntitySets',
        });

        const previousDungeonActionRecords = await this.dungeonActionRepository.getMany({
            parameters: [
                {
                    column: 'dungeon_character_id',
                    value: dungeonActionEntity.dungeon_character_id,
                },
                {
                    column: 'serial_id',
                    value: dungeonActionEntity.serial_id,
                    operator: RepositoryOperator.LessThan,
                },
            ],
            limit: 1,
        });

        if (!previousDungeonActionRecords || !previousDungeonActionRecords.length) {
            logger.info('No previous dungeon character actions, returning...');
            return;
        }

        const dungeonActionRecords = await this.dungeonActionRepository.getMany({
            parameters: [
                {
                    column: 'dungeon_location_id',
                    value: previousDungeonActionRecords[0].dungeon_location_id,
                },
                {
                    column: 'serial_id',
                    value: [previousDungeonActionRecords[0].serial_id, dungeonActionEntity.serial_id],
                    operator: RepositoryOperator.Between,
                },
            ],
        });

        const allDungeonActionRecords = [previousDungeonActionRecords[0], ...dungeonActionRecords];

        const returnDungeonActionEntitySets: DungeonActionEntitySet[] = [];
        for (var idx = 0; idx < allDungeonActionRecords.length; idx++) {
            const dungeonActionRecord = allDungeonActionRecords[idx];
            const dungeonActionRecordSet = await this.getDungeonActionRecordSet(dungeonActionRecord.id);
            returnDungeonActionEntitySets.push(this.buildDungeonActionEntitySet(dungeonActionRecordSet));
        }

        return returnDungeonActionEntitySets;
    }

    async getDungeonActionRecordSet(dungeonActionRecordID: string): Promise<DungeonActionRecordSet> {
        throw new Error('Method not implemented');
    }

    buildDungeonActionEntitySet(dungeonActionRecordSet: DungeonActionRecordSet): DungeonActionEntitySet {
        throw new Error('Method not implemented');
    }

    async getCharacterDungeonActionEntitySets(
        dungeonActionEntity: DungeonActionEntity,
    ): Promise<DungeonActionEntitySet[]> {
        const logger = this.loggerService.logger({
            function: 'getCharacterDungeonActionEntitySets',
        });

        const mostRecentDungeonActionRecords = await this.dungeonActionRepository.getMany({
            parameters: [
                {
                    column: 'dungeon_character_id',
                    value: dungeonActionEntity.dungeon_character_id,
                },
            ],
            limit: 1,
            orderByColumn: 'serial_id',
            orderByDirection: RepositoryOrder.Descending,
        });

        if (!mostRecentDungeonActionRecords || !mostRecentDungeonActionRecords.length) {
            logger.info('No most recent dungeon character actions, returning...');
            return;
        }

        const dungeonActionRecords = await this.dungeonActionRepository.getMany({
            parameters: [
                {
                    column: 'dungeon_location_id',
                    value: mostRecentDungeonActionRecords[0].dungeon_location_id,
                },
                {
                    column: 'serial_id',
                    value: [mostRecentDungeonActionRecords[0].serial_id],
                    operator: RepositoryOperator.GreaterThan,
                },
            ],
        });

        const returnDungeonActionEntitySets: DungeonActionEntitySet[] = [];
        [mostRecentDungeonActionRecords[0], ...dungeonActionRecords].forEach((dungeonActionRecord) => {
            // TODO
            // const dungeonActionRecordSet = await this.getDungeonActionRecordSet(dungeonActionRecord.id);
            // returnDungeonActionEntitySets.push(this.buildDungeonActionEntitySet(dungeonActionRecordSet));
        });

        return returnDungeonActionEntitySets;
    }

    // buildDungeonActionEntitySet(
    //     dungeonActionRecordSet: DungeonActionRecordSet,
    // ): DungeonActionEntitySet {
    //     // TODO: Fill out all dungeon action entities
    //     throw new Error('Method not implemented');
    // }

    buildDungeonActionEntity(dungeonActionRecord: DungeonActionRepositoryRecord): DungeonActionEntity {
        const dungeonActionEntity: DungeonActionEntity = {
            id: dungeonActionRecord.id,
            dungeon_id: dungeonActionRecord.dungeon_id,
            dungeon_location_id: dungeonActionRecord.dungeon_location_id,
            dungeon_character_id: dungeonActionRecord.dungeon_character_id,
            dungeon_monster_id: dungeonActionRecord.dungeon_monster_id,
            serial_id: dungeonActionRecord.serial_id,
            resolved_command: dungeonActionRecord.resolved_command as DungeonActionEntity['resolved_command'],
            resolved_equipped_dungeon_object_name: dungeonActionRecord.resolved_equipped_dungeon_object_name,
            resolved_equipped_dungeon_object_id: dungeonActionRecord.resolved_equipped_dungeon_object_id,
            resolved_stashed_dungeon_object_name: dungeonActionRecord.resolved_stashed_dungeon_object_name,
            resolved_stashed_dungeon_object_id: dungeonActionRecord.resolved_stashed_dungeon_object_id,
            resolved_target_dungeon_object_name: dungeonActionRecord.resolved_target_dungeon_object_name,
            resolved_target_dungeon_object_id: dungeonActionRecord.resolved_target_dungeon_object_id,
            resolved_target_dungeon_character_name: dungeonActionRecord.resolved_target_dungeon_character_name,
            resolved_target_dungeon_character_id: dungeonActionRecord.resolved_target_dungeon_character_id,
            resolved_target_dungeon_monster_name: dungeonActionRecord.resolved_target_dungeon_monster_name,
            resolved_target_dungeon_monster_id: dungeonActionRecord.resolved_target_dungeon_monster_id,
            resolved_target_dungeon_location_direction: dungeonActionRecord.resolved_target_dungeon_location_direction,
            resolved_target_dungeon_location_name: dungeonActionRecord.resolved_target_dungeon_location_name,
            resolved_target_dungeon_location_id: dungeonActionRecord.resolved_target_dungeon_location_id,
            created_at: dungeonActionRecord.created_at,
            updated_at: dungeonActionRecord.updated_at,
        };
        return dungeonActionEntity;
    }
}
