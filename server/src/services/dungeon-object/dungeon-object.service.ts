import { Injectable } from '@nestjs/common';

// Application
import { LoggerService } from '@/core';
import {
    DungeonRepository,
    DungeonObjectRepository,
    DungeonObjectRepositoryRecord,
    DungeonObjectRepositoryParameter,
} from '@/repositories';

import { CreateDungeonObjectEntity, UpdateDungeonObjectEntity, DungeonObjectEntity } from './dungeon-object.entities';

export interface DungeonObjectParameters {
    dungeon_id?: string;
    dungeon_location_id?: string;
}

@Injectable()
export class DungeonObjectService {
    constructor(private loggerService: LoggerService, private dungeonObjectRepository: DungeonObjectRepository) {}

    async getDungeonObject(id: string): Promise<DungeonObjectEntity> {
        const dungeonObjectRecord = await this.dungeonObjectRepository.getOne({
            id: id,
        });
        const dungeonObjectEntity = this.buildDungeonObjectEntity(dungeonObjectRecord);
        return dungeonObjectEntity;
    }

    async getDungeonObjects(parameters?: DungeonObjectParameters): Promise<DungeonObjectEntity[]> {
        // TODO: Can probably write a generic function for this however directly
        // mapping service parameters to repository parameters is probably not
        // going to be a consistent pattern..
        const repositoryParameters: DungeonObjectRepositoryParameter[] = [];
        for (var key in parameters) {
            if (parameters.hasOwnProperty(key)) {
                repositoryParameters.push({
                    column: key,
                    value: parameters[key],
                } as DungeonObjectRepositoryParameter);
            }
        }

        const dungeonObjectRecords = await this.dungeonObjectRepository.getMany({
            parameters: repositoryParameters,
        });

        const dungeonObjectEntities: DungeonObjectEntity[] = [];
        dungeonObjectRecords.forEach((dungeonObjectRecord) => {
            dungeonObjectEntities.push(this.buildDungeonObjectEntity(dungeonObjectRecord));
        });

        return dungeonObjectEntities;
    }

    async createDungeonObject(createDungeonObjectEntity: CreateDungeonObjectEntity): Promise<DungeonObjectEntity> {
        const dungeonObjectRecord: DungeonObjectRepositoryRecord = {
            id: createDungeonObjectEntity.id || null,
            dungeon_id: createDungeonObjectEntity.dungeon_id,
            dungeon_location_id: createDungeonObjectEntity.dungeon_location_id,
            dungeon_character_id: createDungeonObjectEntity.dungeon_character_id,
            dungeon_monster_id: createDungeonObjectEntity.dungeon_monster_id,
            name: createDungeonObjectEntity.name,
            description: createDungeonObjectEntity.description,
            description_long: createDungeonObjectEntity.description_long,
            is_stashed: createDungeonObjectEntity.is_stashed,
            is_equipped: createDungeonObjectEntity.is_equipped,
        };

        await this.dungeonObjectRepository.insertOne({
            record: dungeonObjectRecord,
        });

        const dungeonObjectEntity = this.buildDungeonObjectEntity(dungeonObjectRecord);
        return dungeonObjectEntity;
    }

    async updateDungeonObject(updateDungeonObjectEntity: UpdateDungeonObjectEntity): Promise<DungeonObjectEntity> {
        const dungeonObjectRecord = await this.dungeonObjectRepository.getOne({
            id: updateDungeonObjectEntity.id,
        });

        dungeonObjectRecord.id = updateDungeonObjectEntity.id;
        dungeonObjectRecord.name = updateDungeonObjectEntity.name;

        await this.dungeonObjectRepository.updateOne({
            record: dungeonObjectRecord,
        });

        const dungeonObjectEntity = this.buildDungeonObjectEntity(dungeonObjectRecord);
        return dungeonObjectEntity;
    }

    async deleteDungeonObject(id: string): Promise<void> {
        await this.dungeonObjectRepository.deleteOne({ id: id });
        return;
    }

    buildDungeonObjectEntity(dungeonObjectRecord: DungeonObjectRepositoryRecord): DungeonObjectEntity {
        const dungeonObjectEntity: DungeonObjectEntity = {
            id: dungeonObjectRecord.id,
            dungeon_id: dungeonObjectRecord.dungeon_id,
            dungeon_location_id: dungeonObjectRecord.dungeon_location_id,
            dungeon_character_id: dungeonObjectRecord.dungeon_character_id,
            dungeon_monster_id: dungeonObjectRecord.dungeon_monster_id,
            name: dungeonObjectRecord.name,
            description: dungeonObjectRecord.description,
            description_long: dungeonObjectRecord.description_long,
            is_stashed: dungeonObjectRecord.is_stashed,
            is_equipped: dungeonObjectRecord.is_equipped,
            created_at: dungeonObjectRecord.created_at,
            updated_at: dungeonObjectRecord.updated_at,
        };
        return dungeonObjectEntity;
    }
}
