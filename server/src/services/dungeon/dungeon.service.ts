import { Injectable } from '@nestjs/common';

// Application
import { LoggerService } from '@/core';
import {
    DungeonRepository,
    DungeonRepositoryRecord,
    DungeonRepositoryParameter,
} from '@/repositories';

import {
    CreateDungeonEntity,
    UpdateDungeonEntity,
    DungeonEntity,
} from './dungeon.entities';

export interface DungeonParameters {
    name?: string;
    description?: string;
}

@Injectable()
export class DungeonService {
    constructor(
        private loggerService: LoggerService,
        private dungeonRepository: DungeonRepository,
    ) {}

    async getDungeon(id: string): Promise<DungeonEntity> {
        const dungeonRecord = await this.dungeonRepository.getOne({
            id: id,
        });
        const dungeonEntity = this.buildDungeonEntity(dungeonRecord);
        return dungeonEntity;
    }

    async getDungeons(
        parameters?: DungeonParameters,
    ): Promise<DungeonEntity[]> {
        // TODO: Can probably write a generic function for this however directly
        // mapping service parameters to repository parameters is probably not
        // going to be a consistent pattern..
        const repositoryParameters: DungeonRepositoryParameter[] = [];
        for (var key in parameters) {
            if (parameters.hasOwnProperty(key)) {
                console.log(key + ' -> ' + parameters[key]);
                repositoryParameters.push({
                    column: key,
                    value: parameters[key],
                } as DungeonRepositoryParameter);
            }
        }

        const dungeonRecords = await this.dungeonRepository.getMany({
            parameters: repositoryParameters,
        });

        const dungeonEntities: DungeonEntity[] = [];
        dungeonRecords.forEach((dungeonRecord) => {
            dungeonEntities.push(this.buildDungeonEntity(dungeonRecord));
        });

        return dungeonEntities;
    }

    async createDungeon(
        createEntity: CreateDungeonEntity,
    ): Promise<DungeonEntity> {
        const dungeonRecord: DungeonRepositoryRecord = {
            id: createEntity.id || null,
            name: createEntity.name,
            description: createEntity.description,
        };

        await this.dungeonRepository.insertOne({
            record: dungeonRecord,
        });

        const dungeonEntity = this.buildDungeonEntity(dungeonRecord);
        return dungeonEntity;
    }

    async updateDungeon(
        updateEntity: UpdateDungeonEntity,
    ): Promise<DungeonEntity> {
        const dungeonRecord = await this.dungeonRepository.getOne({
            id: updateEntity.id,
        });

        dungeonRecord.id = updateEntity.id;
        dungeonRecord.name = updateEntity.name;
        dungeonRecord.description = updateEntity.description;

        await this.dungeonRepository.updateOne({
            record: dungeonRecord,
        });

        const dungeonEntity = this.buildDungeonEntity(dungeonRecord);
        return dungeonEntity;
    }

    async deleteDungeon(id: string): Promise<void> {
        await this.dungeonRepository.deleteOne({ id: id });
        return;
    }

    buildDungeonEntity(dungeonRecord: DungeonRepositoryRecord): DungeonEntity {
        const dungeonEntity: DungeonEntity = {
            id: dungeonRecord.id,
            name: dungeonRecord.name,
            description: dungeonRecord.description,
            created_at: dungeonRecord.created_at,
            updated_at: dungeonRecord.updated_at,
            deleted_at: dungeonRecord.deleted_at,
        };
        return dungeonEntity;
    }
}
