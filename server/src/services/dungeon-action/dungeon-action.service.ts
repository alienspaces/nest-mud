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
    DungeonActionCharacterRepositoryRecord,
    DungeonActionMonsterRepositoryRecord,
    DungeonActionObjectRepositoryRecord,
} from '@/repositories';
import { DungeonLocationService } from '@/services/dungeon-location/dungeon-location.service';
import { DungeonCharacterService } from '@/services/dungeon-character/dungeon-character.service';
import { DungeonCharacterEntity } from '@/services/dungeon-character/dungeon-character.entities';
import { DungeonMonsterService } from '@/services/dungeon-monster/dungeon-monster.service';
import { DungeonMonsterEntity } from '@/services/dungeon-monster/dungeon-monster.entities';
import { DungeonObjectService } from '@/services/dungeon-object/dungeon-object.service';
import { DungeonObjectEntity } from '@/services/dungeon-object/dungeon-object.entities';
import { DungeonActionEntitySet, DungeonActionEntity } from './dungeon-action.entities';
import { DungeonCharacterActionResolver } from './dungeon-action.resolver';
import { DungeonLocationRecordSet, DungeonActionEventRecordSet } from './dungeon-action.types';
import { DomainError } from '@/core';

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
        const logger = this.loggerService.logger({
            function: 'processDungeonCharacterAction',
        });

        // Current dungeon location record set
        let records = await this.getDungeonLocationRecordSet(dungeonCharacterID);

        logger.info(`Fetched dungeon location >${records.location.name}< record set`);

        // Resolve character action
        let dungeonActionRecord = this.resolver.resolveAction(sentence, records);
        if (!dungeonActionRecord) {
            logger.warn('Failed to return dungeon action record');
            throw new DomainError(`Failed to resolve command for sentence >${sentence}<`);
        }
        if (!dungeonActionRecord.resolved_command) {
            logger.warn('Failed to populate dungeon action record resolved command');
            throw new DomainError(`Failed to resolve command for sentence >${sentence}<`);
        }

        logger.info(`Have dungeon action record resolved command >${dungeonActionRecord.resolved_command}<`);

        // Perform dungeon character action
        dungeonActionRecord = await this.performDungeonCharacterAction(dungeonActionRecord, records);

        logger.info(`Have updated dungeon action record ${dungeonActionRecord.id}`);

        // Refetch current dungeon location record set
        records = await this.getDungeonLocationRecordSet(dungeonCharacterID);

        logger.info(`Fetched updated dungeon location >${records.location.name}< record set`);

        // Create dungeon action event records
        dungeonActionRecord = await this.createDungeonActionRecord(dungeonActionRecord);

        logger.info(`Created dungeon action record ID ${dungeonActionRecord.id}`);

        if (records.characters) {
            for (var idx = 0; idx < records.characters.length; idx++) {
                const dungeonActionCharacterRecord = await this.createDungeonActionCharacterRecord(
                    dungeonActionRecord,
                    records.characters[idx],
                );
                logger.info(`Created dungeon action character record id ${dungeonActionCharacterRecord.id}`);
            }
        }

        if (records.monsters) {
            for (var idx = 0; idx < records.monsters.length; idx++) {
                const dungeonActionMonsterRecord = await this.createDungeonActionMonsterRecord(
                    dungeonActionRecord,
                    records.monsters[idx],
                );
                logger.info(`Created dungeon action monster record id ${dungeonActionMonsterRecord.id}`);
            }
        }

        if (records.objects) {
            for (var idx = 0; idx < records.objects.length; idx++) {
                const dungeonActionObjectRecord = await this.createDungeonActionObjectRecord(
                    dungeonActionRecord,
                    records.objects[idx],
                );
                logger.info(`Created dungeon action object record id ${dungeonActionObjectRecord.id}`);
            }
        }

        return this.buildDungeonActionEntity(dungeonActionRecord);
    }

    async performDungeonCharacterAction(
        dungeonActionRecord: DungeonActionRepositoryRecord,
        records: DungeonLocationRecordSet,
    ): Promise<DungeonActionRepositoryRecord> {
        const logger = this.loggerService.logger({
            function: 'performDungeonCharacterAction',
        });
        const actionFuncs = {
            move: (dungeonActionRecord: DungeonActionRepositoryRecord, records: DungeonLocationRecordSet) =>
                this.performDungeonActionMove(dungeonActionRecord, records),
            look: (dungeonActionRecord: DungeonActionRepositoryRecord, records: DungeonLocationRecordSet) =>
                this.performDungeonActionLook(dungeonActionRecord, records),
            equip: (dungeonActionRecord: DungeonActionRepositoryRecord, records: DungeonLocationRecordSet) =>
                this.performDungeonActionEquip(dungeonActionRecord, records),
            stash: (dungeonActionRecord: DungeonActionRepositoryRecord, records: DungeonLocationRecordSet) =>
                this.performDungeonActionStash(dungeonActionRecord, records),
            drop: (dungeonActionRecord: DungeonActionRepositoryRecord, records: DungeonLocationRecordSet) =>
                this.performDungeonActionDrop(dungeonActionRecord, records),
        };

        const actionFunc = actionFuncs[dungeonActionRecord.resolved_command];
        if (!actionFunc) {
            throw new DomainError(`Action function for ${dungeonActionRecord.resolved_command} not supported`);
        }

        dungeonActionRecord = await actionFunc(dungeonActionRecord, records);

        logger.info(`Have updated dungeon action record ${dungeonActionRecord}`);

        return dungeonActionRecord;
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
            // Move monster
            // ...
        }
        return dungeonActionRecord;
    }

    async performDungeonActionLook(
        dungeonActionRecord: DungeonActionRepositoryRecord,
        records: DungeonLocationRecordSet,
    ): Promise<DungeonActionRepositoryRecord> {
        // Provide the ability to look multiple times to get more detailed information
        // ...
        return dungeonActionRecord;
    }

    async performDungeonActionEquip(
        dungeonActionRecord: DungeonActionRepositoryRecord,
        records: DungeonLocationRecordSet,
    ): Promise<DungeonActionRepositoryRecord> {
        throw new DomainError('Method equip not implemented');
        return dungeonActionRecord;
    }

    async performDungeonActionStash(
        dungeonActionRecord: DungeonActionRepositoryRecord,
        records: DungeonLocationRecordSet,
    ): Promise<DungeonActionRepositoryRecord> {
        throw new DomainError('Method stash not implemented');
        return dungeonActionRecord;
    }

    async performDungeonActionDrop(
        dungeonActionRecord: DungeonActionRepositoryRecord,
        records: DungeonLocationRecordSet,
    ): Promise<DungeonActionRepositoryRecord> {
        throw new DomainError('Method drop not implemented');
        return dungeonActionRecord;
    }

    // NOTE: The following should probably be returning entities sourced from other services
    // and not from repositories directly
    async getDungeonLocationRecordSet(dungeonCharacterID: string): Promise<DungeonLocationRecordSet> {
        const logger = this.loggerService.logger({
            function: 'getDungeonLocationRecordSet',
        });

        // Character record
        const characterRecord = await this.dungeonCharacterRepository.getOne({
            id: dungeonCharacterID,
            forUpdate: true,
        });
        if (!characterRecord) {
            throw new DomainError(`Character ${dungeonCharacterID} not found, cannot get dungeon location record set`);
        }
        logger.info(`Fetched dungeon character ID ${characterRecord.id}`);

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
        logger.info(`Fetched ${characterRecords.length} dungeon character records`);

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
        logger.info(`Fetched ${monsterRecords.length} dungeon monster records`);

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
        logger.info(`Fetched ${objectRecords.length} dungeon object records`);

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
        logger.info(`Fetched ${locationRecords.length} dungeon location records`);

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

    async getCharacterDungeonActionEntitySets(
        dungeonActionRecord: DungeonActionEntity,
    ): Promise<DungeonActionEntitySet[]> {
        const logger = this.loggerService.logger({
            function: 'getCharacterDungeonActionEntitySet',
        });

        logger.info(
            `**** Fetching previous dungeon action records serial ID ${dungeonActionRecord.serial_id} location ID ${dungeonActionRecord.dungeon_location_id}`,
        );

        // Find this characters previous dungeon action record
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
            orderByColumn: 'serial_id',
            orderByDirection: RepositoryOrder.Descending,
            limit: 1,
        });

        // When there aren't any previous dungeon action records for this character
        // return the dungeon action entity set for the provided dungeon action record
        if (!previousDungeonActionRecords || !previousDungeonActionRecords.length) {
            logger.info('**** No previous dungeon character actions');

            const dungeonActionRecordSet = await this.getDungeonActionEventRecordSet(dungeonActionRecord);
            const dungeonActionEntitySet = await this.buildDungeonActionEntitySet(dungeonActionRecordSet);

            return [dungeonActionEntitySet];
        }

        logger.info(
            `**** Have previous dungeon character action serial ID ${previousDungeonActionRecords[0].serial_id} location ID ${previousDungeonActionRecords[0].dungeon_location_id}`,
        );

        // When there is a previous dungeon action fetch all dungeon action records that
        // occured since that dungeon action at the same location
        const dungeonActionRecords = await this.dungeonActionRepository.getMany({
            parameters: [
                {
                    column: 'dungeon_location_id',
                    value: previousDungeonActionRecords[0].dungeon_location_id,
                },
                {
                    column: 'serial_id',
                    // value: [previousDungeonActionRecords[0].serial_id, dungeonActionRecord.serial_id],
                    value: previousDungeonActionRecords[0].serial_id,
                    operator: RepositoryOperator.GreaterThan,
                },
            ],
        });

        logger.info(`**** Have ${dungeonActionRecords.length} previous dungeon action records`);

        // When there aren't any previous dungeon action records that occurred between this
        // characters previous action and the current action at the previous dungeons location
        // just return the current dungeon action.
        if (!dungeonActionRecords || !dungeonActionRecords.length) {
            logger.info('**** No previous dungeon character actions to return');

            const dungeonActionRecordSet = await this.getDungeonActionEventRecordSet(dungeonActionRecord);
            const dungeonActionEntitySet = await this.buildDungeonActionEntitySet(dungeonActionRecordSet);

            return [dungeonActionEntitySet];
        }

        // const allDungeonActionRecords = [...dungeonActionRecords, dungeonActionRecord];
        const allDungeonActionRecords = [...dungeonActionRecords];

        const returnDungeonActionEntitySets: DungeonActionEntitySet[] = [];
        for (var returnDungeonActionRecord of allDungeonActionRecords) {
            const dungeonActionRecordSet = await this.getDungeonActionEventRecordSet(returnDungeonActionRecord);
            const dungeonActionEntitySet = await this.buildDungeonActionEntitySet(dungeonActionRecordSet);
            returnDungeonActionEntitySets.push(dungeonActionEntitySet);
        }

        logger.info(`**** Returning ${returnDungeonActionEntitySets.length} dungeon action entity sets`);

        return returnDungeonActionEntitySets;
    }

    async getDungeonActionEventRecordSet(
        dungeonActionRecord: DungeonActionRepositoryRecord,
    ): Promise<DungeonActionEventRecordSet> {
        const logger = this.loggerService.logger({
            function: 'getDungeonActionEventRecordSet',
        });

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
        const logger = this.loggerService.logger({
            function: 'createDungeonActionRecord',
        });
        logger.info('Dungeon action record', dungeonActionRecord);
        dungeonActionRecord = await this.dungeonActionRepository.insertOne({
            record: dungeonActionRecord,
        });

        return dungeonActionRecord;
    }

    async createDungeonActionCharacterRecord(
        dungeonActionRecord: DungeonActionRepositoryRecord,
        dungeonCharacterRecord: DungeonCharacterRepositoryRecord,
    ): Promise<DungeonActionCharacterRepositoryRecord> {
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
        return dungeonActionCharacterRecord;
    }

    async createDungeonActionMonsterRecord(
        dungeonActionRecord: DungeonActionRepositoryRecord,
        dungeonMonsterRecord: DungeonMonsterRepositoryRecord,
    ): Promise<DungeonActionMonsterRepositoryRecord> {
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
        return dungeonActionMonsterRecord;
    }

    async createDungeonActionObjectRecord(
        dungeonActionRecord: DungeonActionRepositoryRecord,
        dungeonObjectRecord: DungeonObjectRepositoryRecord,
    ): Promise<DungeonActionObjectRepositoryRecord> {
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
        return dungeonActionObjectRecord;
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

        const dungeonCharacterEntities: DungeonCharacterEntity[] = [];
        if (dungeonActionRecordSet.dungeonActionCharacterRecords) {
            for (var dungeonActionCharacterRecord of dungeonActionRecordSet.dungeonActionCharacterRecords) {
                const dungeonCharacterEntity = await this.dungeonCharacterService.getDungeonCharacter(
                    dungeonActionCharacterRecord.dungeon_character_id,
                );
                dungeonCharacterEntities.push(dungeonCharacterEntity);
            }
        }

        const dungeonMonsterEntities: DungeonMonsterEntity[] = [];
        if (dungeonActionRecordSet.dungeonActionMonsterRecords) {
            for (var dungeonActionMonsterRecord of dungeonActionRecordSet.dungeonActionMonsterRecords) {
                const dungeonMonsterEntity = await this.dungeonMonsterService.getDungeonMonster(
                    dungeonActionMonsterRecord.dungeon_monster_id,
                );
                dungeonMonsterEntities.push(dungeonMonsterEntity);
            }
        }

        const dungeonObjectEntities: DungeonObjectEntity[] = [];
        if (dungeonActionRecordSet.dungeonActionObjectRecords) {
            for (var dungeonActionObjectRecord of dungeonActionRecordSet.dungeonActionObjectRecords) {
                const dungeonObjectEntity = await this.dungeonObjectService.getDungeonObject(
                    dungeonActionObjectRecord.dungeon_object_id,
                );
                dungeonObjectEntities.push(dungeonObjectEntity);
            }
        }

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
