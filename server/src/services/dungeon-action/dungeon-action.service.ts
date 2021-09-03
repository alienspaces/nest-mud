import { Injectable } from '@nestjs/common';

// Application
import { LoggerService, RepositoryOperator, RepositoryOrder } from '@/core';
import {
    DungeonCharacterRepository,
    DungeonCharacterRepositoryRecord,
    DungeonLocationRepository,
    DungeonMonsterRepository,
    DungeonMonsterRepositoryRecord,
    DungeonObjectRepository,
    DungeonObjectRepositoryRecord,
    DungeonActionRepository,
    DungeonActionRepositoryRecord,
    DungeonActionCharacterRepository,
    DungeonActionMonsterRepository,
    DungeonActionObjectRepository,
} from '@/repositories';
import { DungeonLocationService } from '@/services/dungeon-location/dungeon-location.service';
import { DungeonCharacterService } from '@/services/dungeon-character/dungeon-character.service';
import { DungeonCharacterEntity } from '@/services/dungeon-character/dungeon-character.entities';
import { DungeonMonsterService } from '@/services/dungeon-monster/dungeon-monster.service';
import { DungeonMonsterEntity } from '@/services/dungeon-monster/dungeon-monster.entities';
import { DungeonObjectService } from '@/services/dungeon-object/dungeon-object.service';
import { DungeonActionEntitySet, DungeonActionEntity } from './dungeon-action.entities';
import { DungeonCharacterActionResolver } from './dungeon-action.resolver';
import { DungeonLocationRecordSet, DungeonActionEventRecordSet } from './dungeon-action.types';

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
        private dungeonActionCharacterRepository: DungeonActionCharacterRepository,
        private dungeonActionMonsterRepository: DungeonActionMonsterRepository,
        private dungeonActionObjectRepository: DungeonActionObjectRepository,
        private dungeonLocationService: DungeonLocationService,
        private dungeonCharacterService: DungeonCharacterService,
        private dungeonMonsterService: DungeonMonsterService,
        private dungeonObjectService: DungeonObjectService,
    ) {
        this.resolver = new DungeonCharacterActionResolver();
    }

    async processDungeonCharacterAction(dungeonCharacterID: string, sentence: string): Promise<DungeonActionEntity> {
        // Current dungeon location record set
        let records = await this.getDungeonLocationRecordSet(dungeonCharacterID);

        // Resolve character action
        let dungeonActionRecord = this.resolver.resolveAction(sentence, records);
        if (!dungeonActionRecord) {
            throw new Error('Failed to resolve action');
        }

        // Perform dungeon character action
        dungeonActionRecord = await this.performDungeonCharacterAction(dungeonActionRecord, records);

        // Refetch current dungeon location record set
        records = await this.getDungeonLocationRecordSet(dungeonCharacterID);

        // Create dungeon action event records
        dungeonActionRecord = await this.createDungeonActionRecord(dungeonActionRecord);

        if (records.characters) {
            for (var idx = 0; idx < records.characters.length; idx++) {
                this.createDungeonActionCharacterRecord(dungeonActionRecord, records.characters[idx]);
            }
        }

        if (records.monsters) {
            for (var idx = 0; idx < records.monsters.length; idx++) {
                this.createDungeonActionMonsterRecord(dungeonActionRecord, records.monsters[idx]);
            }
        }

        if (records.objects) {
            for (var idx = 0; idx < records.objects.length; idx++) {
                this.createDungeonActionObjectRecord(dungeonActionRecord, records.objects[idx]);
            }
        }

        return this.buildDungeonActionEntity(dungeonActionRecord);
    }

    async performDungeonCharacterAction(
        dungeonActionRecord: DungeonActionRepositoryRecord,
        records: DungeonLocationRecordSet,
    ): Promise<DungeonActionRepositoryRecord> {
        const actionFuncs = {
            move: this.performDungeonActionMove,
            look: this.performDungeonActionLook,
            equip: this.performDungeonActionEquip,
            stash: this.performDungeonActionStash,
            drop: this.performDungeonActionDrop,
        };

        return await actionFuncs[dungeonActionRecord.resolved_command](dungeonActionRecord, records);
    }

    async performDungeonActionMove(
        dungeonActionRecord: DungeonActionRepositoryRecord,
        records: DungeonLocationRecordSet,
    ): Promise<DungeonActionRepositoryRecord> {
        if (dungeonActionRecord.dungeon_character_id) {
            // Move character
            let characterRecord = records.character;
            characterRecord.dungeon_location_id = dungeonActionRecord.resolved_target_dungeon_location_id;
            characterRecord = await this.dungeonCharacterRepository.updateOne({ record: characterRecord });
            // Update dungeon action entity
            dungeonActionRecord.dungeon_location_id = dungeonActionRecord.resolved_target_dungeon_location_id;
        } else if (dungeonActionRecord.dungeon_monster_id) {
            // TODO: Move monster
        }
        return dungeonActionRecord;
    }

    async performDungeonActionLook(
        dungeonActionRecord: DungeonActionRepositoryRecord,
        records: DungeonLocationRecordSet,
    ): Promise<DungeonActionRepositoryRecord> {
        throw new Error('Method not implemented');
        return dungeonActionRecord;
    }

    async performDungeonActionEquip(
        dungeonActionRecord: DungeonActionRepositoryRecord,
        records: DungeonLocationRecordSet,
    ): Promise<DungeonActionRepositoryRecord> {
        throw new Error('Method not implemented');
        return dungeonActionRecord;
    }

    async performDungeonActionStash(
        dungeonActionRecord: DungeonActionRepositoryRecord,
        records: DungeonLocationRecordSet,
    ): Promise<DungeonActionRepositoryRecord> {
        throw new Error('Method not implemented');
        return dungeonActionRecord;
    }

    async performDungeonActionDrop(
        dungeonActionRecord: DungeonActionRepositoryRecord,
        records: DungeonLocationRecordSet,
    ): Promise<DungeonActionRepositoryRecord> {
        throw new Error('Method not implemented');
        return dungeonActionRecord;
    }

    async getDungeonLocationRecordSet(dungeonCharacterID: string): Promise<DungeonLocationRecordSet> {
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
        const records: DungeonLocationRecordSet = {
            character: characterRecord,
            location: locationRecord,
            characters: characterRecords,
            monsters: monsterRecords,
            objects: objectRecords,
            locations: locationRecords,
        };

        return records;
    }

    async getCharacterDungeonActionEntitySet(
        dungeonActionRecord: DungeonActionEntity,
    ): Promise<DungeonActionEntitySet[]> {
        const logger = this.loggerService.logger({
            function: 'getCharacterDungeonActionEntitySet',
        });

        const previousDungeonActionRecords = await this.dungeonActionRepository.getMany({
            parameters: [
                {
                    column: 'dungeon_character_id',
                    value: dungeonActionRecord.dungeon_character_id,
                },
                {
                    column: 'serial_id',
                    value: dungeonActionRecord.serial_id,
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
                    value: [previousDungeonActionRecords[0].serial_id, dungeonActionRecord.serial_id],
                    operator: RepositoryOperator.Between,
                },
            ],
        });

        const allDungeonActionRecords = [previousDungeonActionRecords[0], ...dungeonActionRecords];

        const returnDungeonActionEntitySets: DungeonActionEntitySet[] = [];
        for (var idx = 0; idx < allDungeonActionRecords.length; idx++) {
            const dungeonActionRecord = allDungeonActionRecords[idx];
            const dungeonActionRecordSet = await this.getDungeonActionEventRecordSet(dungeonActionRecord);
            const dungeonActionEntitySet = await this.buildDungeonActionEntitySet(dungeonActionRecordSet);
            returnDungeonActionEntitySets.push(dungeonActionEntitySet);
        }

        return returnDungeonActionEntitySets;
    }

    async getDungeonActionEventRecordSet(
        dungeonActionRecord: DungeonActionRepositoryRecord,
    ): Promise<DungeonActionEventRecordSet> {
        const dungeonActionEventRecordSet: DungeonActionEventRecordSet = {
            dungeonActionRecord: dungeonActionRecord,
        };

        const dungeonActionCharacterRecords = await this.dungeonActionCharacterRepository.getMany({
            parameters: [
                {
                    column: 'dungeon_action_id',
                    value: dungeonActionRecord.id,
                },
            ],
        });
        dungeonActionEventRecordSet.dungeonActionCharacterRecords = dungeonActionCharacterRecords;

        const dungeonActionMonsterRecords = await this.dungeonActionMonsterRepository.getMany({
            parameters: [
                {
                    column: 'dungeon_action_id',
                    value: dungeonActionRecord.id,
                },
            ],
        });
        dungeonActionEventRecordSet.dungeonActionMonsterRecords = dungeonActionMonsterRecords;

        const dungeonActionObjectRecords = await this.dungeonActionObjectRepository.getMany({
            parameters: [
                {
                    column: 'dungeon_action_id',
                    value: dungeonActionRecord.id,
                },
            ],
        });
        dungeonActionEventRecordSet.dungeonActionObjectRecords = dungeonActionObjectRecords;

        return dungeonActionEventRecordSet;
    }

    async createDungeonActionRecord(
        dungeonActionRecord: DungeonActionRepositoryRecord,
    ): Promise<DungeonActionRepositoryRecord> {
        dungeonActionRecord = await this.dungeonActionRepository.insertOne({
            record: dungeonActionRecord,
        });

        return dungeonActionRecord;
    }

    async createDungeonActionCharacterRecord(
        dungeonActionRecord: DungeonActionRepositoryRecord,
        dungeonCharacterRecord: DungeonCharacterRepositoryRecord,
    ): Promise<void> {
        const logger = this.loggerService.logger({
            function: 'createDungeonActionCharacterRecord',
        });
        const dungeonActionCharacterRecord = await this.dungeonActionCharacterRepository.insertOne({
            record: {
                dungeon_action_id: dungeonActionRecord.id,
                dungeon_character_id: dungeonCharacterRecord.id,
            },
        });
        logger.info(`Created dungeon action character record ID ${dungeonActionCharacterRecord.id}`);
        return;
    }

    async createDungeonActionMonsterRecord(
        dungeonActionRecord: DungeonActionRepositoryRecord,
        dungeonMonsterRecord: DungeonMonsterRepositoryRecord,
    ): Promise<void> {
        const logger = this.loggerService.logger({
            function: 'createDungeonActionMonsterRecord',
        });
        const dungeonActionMonsterRecord = await this.dungeonActionMonsterRepository.insertOne({
            record: {
                dungeon_action_id: dungeonActionRecord.id,
                dungeon_monster_id: dungeonMonsterRecord.id,
            },
        });
        logger.info(`Created dungeon action monster record ID ${dungeonActionMonsterRecord.id}`);
        return;
    }

    async createDungeonActionObjectRecord(
        dungeonActionRecord: DungeonActionRepositoryRecord,
        dungeonObjectRecord: DungeonObjectRepositoryRecord,
    ): Promise<void> {
        const logger = this.loggerService.logger({
            function: 'createDungeonActionObjectRecord',
        });
        const dungeonActionObjectRecord = await this.dungeonActionObjectRepository.insertOne({
            record: {
                dungeon_action_id: dungeonActionRecord.id,
                dungeon_object_id: dungeonObjectRecord.id,
            },
        });
        logger.info(`Created dungeon action object record ID ${dungeonActionObjectRecord.id}`);
        return;
    }

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

    async buildDungeonActionEntitySet(
        dungeonActionRecordSet: DungeonActionEventRecordSet,
    ): Promise<DungeonActionEntitySet> {
        const dungeonActionEntity = this.buildDungeonActionEntity(dungeonActionRecordSet.dungeonActionRecord);
        const dungeonLocationEntity = await this.dungeonLocationService.getDungeonLocation(
            dungeonActionRecordSet.dungeonActionRecord.dungeon_location_id,
        );

        let dungeonCharacterEntity: DungeonCharacterEntity;
        if (dungeonActionRecordSet.dungeonActionRecord.dungeon_character_id) {
            dungeonCharacterEntity = await this.dungeonCharacterService.getDungeonCharacter(
                dungeonActionRecordSet.dungeonActionRecord.dungeon_character_id,
            );
        }

        let dungeonMonsterEntity: DungeonMonsterEntity;
        if (dungeonActionRecordSet.dungeonActionRecord.dungeon_monster_id) {
            dungeonMonsterEntity = await this.dungeonMonsterService.getDungeonMonster(
                dungeonActionRecordSet.dungeonActionRecord.dungeon_monster_id,
            );
        }

        const dungeonCharacterEntities = await this.dungeonCharacterService.getDungeonCharacters({
            dungeon_location_id: dungeonActionRecordSet.dungeonActionRecord.dungeon_location_id,
        });

        const dungeonMonsterEntities = await this.dungeonMonsterService.getDungeonMonsters({
            dungeon_location_id: dungeonActionRecordSet.dungeonActionRecord.dungeon_location_id,
        });

        const dungeonObjectEntities = await this.dungeonObjectService.getDungeonObjects({
            dungeon_location_id: dungeonActionRecordSet.dungeonActionRecord.dungeon_location_id,
        });

        const dungeonActionEntitySet = {
            dungeonActionEntity: dungeonActionEntity,
            dungeonLocationEntity: dungeonLocationEntity,
            dungeonCharacterEntity: dungeonCharacterEntity,
            dungeonMonsterEntity: dungeonMonsterEntity,
            dungeonCharacterEntities: dungeonCharacterEntities,
            dungeonMonsterEntities: dungeonMonsterEntities,
            dungeonObjectEntities: dungeonObjectEntities,
        };

        return dungeonActionEntitySet;
    }
}
