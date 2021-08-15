import { Injectable } from '@nestjs/common';

// Application
import { LoggerService } from '@/core';
import {
    DungeonRepository,
    DungeonRepositoryRecord,
    DungeonRepositoryParameter,
    DungeonLocationRepository,
    DungeonLocationRepositoryRecord,
    DungeonLocationRepositoryParameter,
} from '@/repositories';

import {
    CreateDungeonEntity,
    UpdateDungeonEntity,
    DungeonEntity,
    CreateDungeonLocationEntity,
    UpdateDungeonLocationEntity,
    DungeonLocationEntity,
} from './dungeon.entities';

export interface DungeonParameters {
    name?: string;
    description?: string;
}

export interface DungeonLocationParameters {
    name?: string;
    description?: string;
    default?: boolean;
    north_location_id?: string;
    northeast_location_id?: string;
    east_location_id?: string;
    southeast_location_id?: string;
    south_location_id?: string;
    southwest_location_id?: string;
    west_location_id?: string;
    northwest_location_id?: string;
    up_location_id?: string;
}

@Injectable()
export class DungeonService {
    constructor(
        private loggerService: LoggerService,
        private dungeonRepository: DungeonRepository,
        private dungeonLocationRepository: DungeonLocationRepository,
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
        const repositoryParameters: DungeonRepositoryParameter[] = [];

        // TODO: Can probably write a generic function for this however directly
        // mapping service parameters to repository parameters is probably not
        // going to be a consistent pattern..
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

    async getDungeonLocation(id: string): Promise<DungeonLocationEntity> {
        const dungeonLocationRecord =
            await this.dungeonLocationRepository.getOne({
                id: id,
            });
        const locationEntity = this.buildDungeonLocationEntity(
            dungeonLocationRecord,
        );
        return locationEntity;
    }

    async getDungeonLocations(
        parameters?: DungeonLocationParameters,
    ): Promise<DungeonLocationEntity[]> {
        const repositoryParameters: DungeonLocationRepositoryParameter[] = [];

        // TODO: Can probably write a generic function for this however directly
        // mapping service parameters to repository parameters is probably not
        // going to be a consistent pattern..
        for (var key in parameters) {
            if (parameters.hasOwnProperty(key)) {
                console.log(key + ' -> ' + parameters[key]);
                repositoryParameters.push({
                    column: key,
                    value: parameters[key],
                } as DungeonLocationRepositoryParameter);
            }
        }

        const dungeonLocationRecords =
            await this.dungeonLocationRepository.getMany({
                parameters: repositoryParameters,
            });

        const locationEntities: DungeonLocationEntity[] = [];
        dungeonLocationRecords.forEach((dungeonLocationRecord) => {
            locationEntities.push(
                this.buildDungeonLocationEntity(dungeonLocationRecord),
            );
        });

        return locationEntities;
    }

    async createDungeonLocation(
        createLocationEntity: CreateDungeonLocationEntity,
    ): Promise<DungeonLocationEntity> {
        const dungeonLocationRecord: DungeonLocationRepositoryRecord = {
            id: createLocationEntity.id || null,
            dungeon_id: createLocationEntity.dungeon_id,
            name: createLocationEntity.name,
            description: createLocationEntity.description,
            default: createLocationEntity.default,
            north_dungeon_location_id:
                createLocationEntity.north_dungeon_location_id,
            northeast_dungeon_location_id:
                createLocationEntity.northeast_dungeon_location_id,
            east_dungeon_location_id:
                createLocationEntity.east_dungeon_location_id,
            southeast_dungeon_location_id:
                createLocationEntity.southeast_dungeon_location_id,
            south_dungeon_location_id:
                createLocationEntity.south_dungeon_location_id,
            southwest_dungeon_location_id:
                createLocationEntity.southwest_dungeon_location_id,
            west_dungeon_location_id:
                createLocationEntity.west_dungeon_location_id,
            northwest_dungeon_location_id:
                createLocationEntity.northwest_dungeon_location_id,
            up_dungeon_location_id: createLocationEntity.up_dungeon_location_id,
            down_dungeon_location_id:
                createLocationEntity.down_dungeon_location_id,
        };

        await this.dungeonLocationRepository.insertOne({
            record: dungeonLocationRecord,
        });

        const locationEntity = this.buildDungeonLocationEntity(
            dungeonLocationRecord,
        );
        return locationEntity;
    }

    async updateDungeonLocation(
        updateLocationEntity: UpdateDungeonLocationEntity,
    ): Promise<DungeonLocationEntity> {
        const dungeonLocationRecord =
            await this.dungeonLocationRepository.getOne({
                id: updateLocationEntity.id,
            });

        dungeonLocationRecord.id = updateLocationEntity.id;
        dungeonLocationRecord.name = updateLocationEntity.name;
        dungeonLocationRecord.description = updateLocationEntity.description;
        dungeonLocationRecord.default = updateLocationEntity.default;
        dungeonLocationRecord.north_dungeon_location_id =
            updateLocationEntity.north_dungeon_location_id;
        dungeonLocationRecord.northeast_dungeon_location_id =
            updateLocationEntity.northeast_dungeon_location_id;
        dungeonLocationRecord.east_dungeon_location_id =
            updateLocationEntity.east_dungeon_location_id;
        dungeonLocationRecord.southeast_dungeon_location_id =
            updateLocationEntity.southeast_dungeon_location_id;
        dungeonLocationRecord.south_dungeon_location_id =
            updateLocationEntity.south_dungeon_location_id;
        dungeonLocationRecord.southwest_dungeon_location_id =
            updateLocationEntity.southwest_dungeon_location_id;
        dungeonLocationRecord.west_dungeon_location_id =
            updateLocationEntity.west_dungeon_location_id;
        dungeonLocationRecord.northwest_dungeon_location_id =
            updateLocationEntity.northwest_dungeon_location_id;
        dungeonLocationRecord.up_dungeon_location_id =
            updateLocationEntity.up_dungeon_location_id;
        dungeonLocationRecord.down_dungeon_location_id =
            updateLocationEntity.down_dungeon_location_id;

        await this.dungeonLocationRepository.updateOne({
            record: dungeonLocationRecord,
        });

        const locationEntity = this.buildDungeonLocationEntity(
            dungeonLocationRecord,
        );
        return locationEntity;
    }

    async deleteDungeonLocation(id: string): Promise<void> {
        await this.dungeonLocationRepository.deleteOne({ id: id });
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

    buildDungeonLocationEntity(
        dungeonLocationRecord: DungeonLocationRepositoryRecord,
    ): DungeonLocationEntity {
        const dungeonLocationEntity: DungeonLocationEntity = {
            id: dungeonLocationRecord.id,
            dungeon_id: dungeonLocationRecord.id,
            name: dungeonLocationRecord.name,
            description: dungeonLocationRecord.description,
            default: dungeonLocationRecord.default,
            north_dungeon_location_id:
                dungeonLocationRecord.north_dungeon_location_id,
            northeast_dungeon_location_id:
                dungeonLocationRecord.northeast_dungeon_location_id,
            east_dungeon_location_id:
                dungeonLocationRecord.east_dungeon_location_id,
            southeast_dungeon_location_id:
                dungeonLocationRecord.southeast_dungeon_location_id,
            south_dungeon_location_id:
                dungeonLocationRecord.south_dungeon_location_id,
            southwest_dungeon_location_id:
                dungeonLocationRecord.southwest_dungeon_location_id,
            west_dungeon_location_id:
                dungeonLocationRecord.west_dungeon_location_id,
            northwest_dungeon_location_id:
                dungeonLocationRecord.northwest_dungeon_location_id,
            up_dungeon_location_id:
                dungeonLocationRecord.up_dungeon_location_id,
            down_dungeon_location_id:
                dungeonLocationRecord.down_dungeon_location_id,
            created_at: dungeonLocationRecord.created_at,
            updated_at: dungeonLocationRecord.updated_at,
            deleted_at: dungeonLocationRecord.deleted_at,
        };
        return dungeonLocationEntity;
    }
}
