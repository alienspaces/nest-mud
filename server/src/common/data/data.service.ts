import { Injectable, Scope } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as faker from 'faker';

// Application
import { LoggerService, DatabaseService } from '@/core';
import {
    CreateDungeonEntity,
    DungeonEntity,
    DungeonService,
    CreateDungeonLocationEntity,
    DungeonLocationEntity,
    DungeonLocationService,
    CreateDungeonCharacterEntity,
    DungeonCharacterEntity,
    DungeonCharacterService,
    CreateDungeonMonsterEntity,
    DungeonMonsterEntity,
    DungeonMonsterService,
    CreateDungeonObjectEntity,
    DungeonObjectEntity,
    DungeonObjectService,
    DungeonActionEntity,
    DungeonActionService,
} from '@/services';
import { DataConfig, DungeonConfig } from './data.config';

export class Data {
    dungeonEntities: DungeonEntity[] = [];
    dungeonLocationEntities: DungeonLocationEntity[] = [];
    dungeonCharacterEntities: DungeonCharacterEntity[] = [];
    dungeonMonsterEntities: DungeonMonsterEntity[] = [];
    dungeonObjectEntities: DungeonObjectEntity[] = [];
    dungeonActionEntities: DungeonActionEntity[] = [];

    private _dungeonTeardownIds: string[] = [];
    private _dungeonLocationTeardownIds: string[] = [];
    private _characterTeardownIds: string[] = [];
    private _monsterTeardownIds: string[] = [];
    private _objectTeardownIds: string[] = [];
    private _actionTeardownIds: string[] = [];

    constructor() {
        this.dungeonEntities = [];
        this._dungeonTeardownIds = [];
        this.dungeonLocationEntities = [];
        this._dungeonLocationTeardownIds = [];
        this.dungeonCharacterEntities = [];
        this._characterTeardownIds = [];
        this.dungeonMonsterEntities = [];
        this._monsterTeardownIds = [];
        this.dungeonObjectEntities = [];
        this._objectTeardownIds = [];
        this.dungeonActionEntities = [];
        this._actionTeardownIds = [];
    }

    getDungeonTeardownIds(): string[] {
        return this._dungeonTeardownIds;
    }

    getDungeonLocationTeardownIds(): string[] {
        return this._dungeonLocationTeardownIds;
    }

    getCharacterTeardownIds(): string[] {
        return this._characterTeardownIds;
    }

    getMonsterTeardownIds(): string[] {
        return this._monsterTeardownIds;
    }

    getObjectTeardownIds(): string[] {
        return this._objectTeardownIds;
    }

    getActionTeardownIds(): string[] {
        return this._actionTeardownIds;
    }

    clearDungeonEntities() {
        this.dungeonEntities = [];
        this._dungeonTeardownIds = [];
    }

    clearDungeonLocationEntities() {
        this.dungeonLocationEntities = [];
        this._dungeonLocationTeardownIds = [];
    }

    clearCharacterEntities() {
        this.dungeonCharacterEntities = [];
        this._characterTeardownIds = [];
    }

    clearMonsterEntities() {
        this.dungeonMonsterEntities = [];
        this._monsterTeardownIds = [];
    }

    clearObjectEntities() {
        this.dungeonObjectEntities = [];
        this._objectTeardownIds = [];
    }

    clearActionEntities() {
        this.dungeonActionEntities = [];
        this._actionTeardownIds = [];
    }

    addDungeonTeardownId(id: string) {
        this._dungeonTeardownIds.push(`'${id}'`);
    }

    addDungeonLocationTeardownId(id: string) {
        this._dungeonLocationTeardownIds.push(`'${id}'`);
    }

    addCharacterTeardownId(id: string) {
        this._characterTeardownIds.push(`'${id}'`);
    }

    addMonsterTeardownId(id: string) {
        this._monsterTeardownIds.push(`'${id}'`);
    }

    addObjectTeardownId(id: string) {
        this._objectTeardownIds.push(`'${id}'`);
    }

    addActionTeardownId(id: string) {
        this._actionTeardownIds.push(`'${id}'`);
    }
}

@Injectable({ scope: Scope.TRANSIENT })
export class DataService {
    private _instanceID: string;
    private _dataPersisted: boolean;

    constructor(
        private loggerService: LoggerService,
        private databaseService: DatabaseService,
        private dungeonService: DungeonService,
        private dungeonLocationService: DungeonLocationService,
        private dungeonCharacterService: DungeonCharacterService,
        private dungeonMonsterService: DungeonMonsterService,
        private dungeonObjectService: DungeonObjectService,
    ) {
        this._instanceID = uuidv4();
    }

    async setup(config: DataConfig, data: Data, commit?: boolean) {
        const logger = this.loggerService.logger({
            class: 'DataService',
            function: 'setup',
        });

        logger.debug(`Setting up >${this._instanceID}<`);

        // Establish database service client connection
        await this.databaseService.connect();

        // Assign identifiers to all entities
        this.assignConfigIdentifiers(config);

        // Update all identities with missing required properties
        this.assignConfigRequired(config);

        for (var idx = 0; idx < config.dungeonConfig.length; idx++) {
            const dungeonConfig = config.dungeonConfig[idx];

            // Dungeon entity
            await this.addDungeonEntity(data, dungeonConfig.entity as CreateDungeonEntity);

            // Resolve all dungeon identifiers on entities where entity
            // configuration references a dungeon by name
            this.resolveConfigDungeonIdentifiers(dungeonConfig);

            // Add dungeon location entities
            for (var idx = 0; idx < dungeonConfig.dungeonLocationConfig.length; idx++) {
                // Assign default location
                if (dungeonConfig.dungeonLocationConfig[idx].entity.name == dungeonConfig.defaultDungeonLocationName) {
                    dungeonConfig.dungeonLocationConfig[idx].entity.default = true;
                } else {
                    dungeonConfig.dungeonLocationConfig[idx].entity.default = false;
                }

                await this.addDungeonLocationEntity(
                    data,
                    dungeonConfig.dungeonLocationConfig[idx].entity as CreateDungeonLocationEntity,
                );
            }

            // Resolve all location identifiers on entities where entity
            // configuration references a location by name
            this.resolveConfigLocationIdentifiers(dungeonConfig);

            // Update dungeon location entities
            if (dungeonConfig.dungeonLocationConfig) {
                logger.debug(`Adding ${dungeonConfig.dungeonLocationConfig.length} dungeon locations`);
                for (var idx = 0; idx < dungeonConfig.dungeonLocationConfig.length; idx++) {
                    await this.updateDungeonLocationEntity(
                        dungeonConfig.dungeonLocationConfig[idx].entity as DungeonLocationEntity,
                    );
                }
            }

            // Add character entities
            if (dungeonConfig.dungeonCharacterConfig) {
                logger.debug(`Adding ${dungeonConfig.dungeonCharacterConfig.length} dungeon characters`);
                for (var idx = 0; idx < dungeonConfig.dungeonCharacterConfig.length; idx++) {
                    await this.addCharacterEntity(
                        data,
                        dungeonConfig.dungeonCharacterConfig[idx].entity as CreateDungeonCharacterEntity,
                    );
                }
            }

            // Add monster entities
            if (dungeonConfig.dungeonMonsterConfig) {
                logger.debug(`Adding ${dungeonConfig.dungeonMonsterConfig.length} dungeon monsters`);
                for (var idx = 0; idx < dungeonConfig.dungeonMonsterConfig.length; idx++) {
                    await this.addMonsterEntity(
                        data,
                        dungeonConfig.dungeonMonsterConfig[idx].entity as CreateDungeonMonsterEntity,
                    );
                }
            }

            // Add object entities
            if (dungeonConfig.dungeonObjectConfig) {
                logger.debug(`Adding ${dungeonConfig.dungeonObjectConfig.length} dungeon objects`);
                for (var idx = 0; idx < dungeonConfig.dungeonObjectConfig.length; idx++) {
                    await this.addObjectEntity(
                        data,
                        dungeonConfig.dungeonObjectConfig[idx].entity as CreateDungeonObjectEntity,
                    );
                }
            }
        }

        // Close database service client connection with commit when persisting data
        if (commit) {
            await this.databaseService.end(true);
            this._dataPersisted = true;
        }

        logger.debug('Done');
    }

    async teardown(data: Data) {
        // Re-establish database service client connection when data has been persisted
        if (this._dataPersisted) {
            await this.databaseService.connect();
        }

        await this.removeActionEntities(data);
        await this.removeObjectEntities(data);
        await this.removeMonsterEntities(data);
        await this.removeCharacterEntities(data);
        await this.removeDungeonLocationEntities(data);
        await this.removeDungeonEntities(data);

        // Close database service client connection
        await this.databaseService.end(this._dataPersisted);
    }

    private async addDungeonEntity(data: Data, dungeon: CreateDungeonEntity): Promise<DungeonEntity[]> {
        const logger = this.loggerService.logger({
            class: 'DataService',
            function: 'addDungeonEntity',
        });
        logger.debug(dungeon);
        const dungeonEntity = await this.dungeonService.createDungeon(dungeon);
        data.dungeonEntities.push(dungeonEntity);
        data.addDungeonTeardownId(dungeonEntity.id);
        return;
    }

    private async addDungeonLocationEntity(
        data: Data,
        location: CreateDungeonLocationEntity,
    ): Promise<DungeonLocationEntity[]> {
        const logger = this.loggerService.logger({
            class: 'DataService',
            function: 'addDungeonLocationEntity',
        });
        logger.debug(location);
        const locationEntity = await this.dungeonLocationService.createDungeonLocation(location);
        data.dungeonLocationEntities.push(locationEntity);
        data.addDungeonLocationTeardownId(locationEntity.id);
        return;
    }

    private async updateDungeonLocationEntity(location: DungeonLocationEntity): Promise<DungeonLocationEntity[]> {
        const logger = this.loggerService.logger({
            class: 'DataService',
            function: 'updateDungeonLocationEntity',
        });
        logger.debug(location);
        await this.dungeonLocationService.updateDungeonLocation(location);
        return;
    }

    private async addCharacterEntity(
        data: Data,
        character: CreateDungeonCharacterEntity,
    ): Promise<DungeonCharacterEntity[]> {
        const logger = this.loggerService.logger({
            class: 'DataService',
            function: 'addCharacterEntity',
        });
        logger.debug(character);
        const characterEntity = await this.dungeonCharacterService.createDungeonCharacter(character);
        data.dungeonCharacterEntities.push(characterEntity);
        data.addCharacterTeardownId(characterEntity.id);
        return;
    }

    private async addMonsterEntity(data: Data, monster: CreateDungeonMonsterEntity): Promise<DungeonMonsterEntity[]> {
        const logger = this.loggerService.logger({
            class: 'DataService',
            function: 'addMonsterEntity',
        });
        logger.debug(monster);
        const monsterEntity = await this.dungeonMonsterService.createDungeonMonster(monster);
        data.dungeonMonsterEntities.push(monsterEntity);
        data.addMonsterTeardownId(monsterEntity.id);
        return;
    }

    private async addObjectEntity(data: Data, object: CreateDungeonObjectEntity): Promise<DungeonObjectEntity[]> {
        const logger = this.loggerService.logger({
            class: 'DataService',
            function: 'addObjectEntity',
        });
        logger.debug(object);
        const objectEntity = await this.dungeonObjectService.createDungeonObject(object);
        data.dungeonObjectEntities.push(objectEntity);
        data.addObjectTeardownId(objectEntity.id);
        return;
    }

    private async removeDungeonEntities(data: Data) {
        const logger = this.loggerService.logger({
            class: 'DataService',
            function: 'removeDungeonEntities',
        });

        const client = await this.databaseService.connect();
        const sql = `DELETE FROM dungeon WHERE id IN (${data.getDungeonTeardownIds().join(',')});`;
        logger.debug(sql);

        try {
            await client.query(sql);
        } catch (e) {
            logger.error(e);
            await this.databaseService.end();
        }

        data.clearDungeonEntities();
    }

    private async removeDungeonLocationEntities(data: Data) {
        const logger = this.loggerService.logger({
            class: 'DataService',
            function: 'removeLocationEntities',
        });

        const teardownIDs = data.getDungeonLocationTeardownIds();
        if (!teardownIDs.length) {
            logger.debug('No dungeon locations to teardown, skipping...');
            return;
        }

        const client = await this.databaseService.connect();
        const sql = `DELETE FROM dungeon_location WHERE id IN (${teardownIDs.join(',')});`;
        logger.debug(sql);

        try {
            await client.query(sql);
        } catch (e) {
            logger.error(e);
            await this.databaseService.end();
        }

        data.clearDungeonLocationEntities();
    }

    private async removeCharacterEntities(data: Data) {
        const logger = this.loggerService.logger({
            class: 'DataService',
            function: 'removeCharacterEntities',
        });

        const teardownIDs = data.getCharacterTeardownIds();
        if (!teardownIDs.length) {
            logger.debug('No dungeon characters to teardown, skipping...');
            return;
        }

        const client = await this.databaseService.connect();
        const sql = `DELETE FROM dungeon_character WHERE id IN (${teardownIDs.join(',')});`;
        logger.debug(sql);

        try {
            await client.query(sql);
        } catch (e) {
            logger.error(e);
            await this.databaseService.end();
        }

        data.clearCharacterEntities();
    }

    private async removeMonsterEntities(data: Data) {
        const logger = this.loggerService.logger({
            class: 'DataService',
            function: 'removeMonsterEntities',
        });

        const teardownIDs = data.getMonsterTeardownIds();
        if (!teardownIDs.length) {
            logger.debug('No dungeon monsters to teardown, skipping...');
            return;
        }

        const client = await this.databaseService.connect();
        const sql = `DELETE FROM dungeon_monster WHERE id IN (${teardownIDs.join(',')});`;
        logger.debug(sql);

        try {
            await client.query(sql);
        } catch (e) {
            logger.error(e);
            await this.databaseService.end();
        }

        data.clearMonsterEntities();
    }

    private async removeActionEntities(data: Data) {
        const logger = this.loggerService.logger({
            class: 'DataService',
            function: 'removeActionEntities',
        });

        const teardownIDs = data.getActionTeardownIds();
        if (!teardownIDs.length) {
            logger.warn('No dungeon actions to teardown, skipping...');
            return;
        }

        const client = await this.databaseService.connect();
        let sql = `DELETE FROM dungeon_action_object WHERE dungeon_action_id IN (${teardownIDs.join(',')});`;
        logger.warn(sql);

        try {
            await client.query(sql);
        } catch (e) {
            logger.error(e);
            await this.databaseService.end();
        }

        sql = `DELETE FROM dungeon_action_monster WHERE dungeon_action_id IN (${teardownIDs.join(',')});`;
        logger.warn(sql);

        try {
            await client.query(sql);
        } catch (e) {
            logger.error(e);
            await this.databaseService.end();
        }

        sql = `DELETE FROM dungeon_action_character WHERE dungeon_action_id IN (${teardownIDs.join(',')});`;
        logger.warn(sql);

        try {
            await client.query(sql);
        } catch (e) {
            logger.error(e);
            await this.databaseService.end();
        }

        sql = `DELETE FROM dungeon_action WHERE id IN (${teardownIDs.join(',')});`;
        logger.warn(sql);

        try {
            await client.query(sql);
        } catch (e) {
            logger.error(e);
            await this.databaseService.end();
        }

        data.clearActionEntities();
    }

    private async removeObjectEntities(data: Data) {
        const logger = this.loggerService.logger({
            class: 'DataService',
            function: 'removeObjectEntities',
        });

        const teardownIDs = data.getObjectTeardownIds();
        if (!teardownIDs.length) {
            logger.debug('No dungeon objects to teardown, skipping...');
            return;
        }

        const client = await this.databaseService.connect();
        const sql = `DELETE FROM dungeon_object WHERE id IN (${teardownIDs.join(',')});`;
        logger.debug(sql);

        try {
            await client.query(sql);
        } catch (e) {
            logger.error(e);
            await this.databaseService.end();
        }

        data.clearObjectEntities();
    }

    private getLocationIdentifier(dungeonConfig: DungeonConfig, name: string): string {
        const logger = this.loggerService.logger({
            class: 'DataService',
            function: 'getLocationIdentifier',
        });
        for (var idx = 0; idx < dungeonConfig.dungeonLocationConfig.length; idx++) {
            if (dungeonConfig.dungeonLocationConfig[idx].entity.name === name) {
                logger.info(`Returning >${dungeonConfig.dungeonLocationConfig[idx].entity.id}< for >${name}<`);
                return dungeonConfig.dungeonLocationConfig[idx].entity.id;
            }
        }
        return;
    }

    private assignConfigIdentifiers(config: DataConfig) {
        for (var dungeonIdx = 0; dungeonIdx < config.dungeonConfig.length; dungeonIdx++) {
            const dungeonConfig = config.dungeonConfig[dungeonIdx];
            if (!dungeonConfig.entity.id) {
                dungeonConfig.entity.id = uuidv4();
            }

            for (var idx = 0; idx < dungeonConfig.dungeonLocationConfig.length; idx++) {
                if (!dungeonConfig.dungeonLocationConfig[idx].entity.id) {
                    dungeonConfig.dungeonLocationConfig[idx].entity.id = uuidv4();
                }
            }
            for (var idx = 0; idx < dungeonConfig.dungeonCharacterConfig.length; idx++) {
                if (!dungeonConfig.dungeonCharacterConfig[idx].entity.id) {
                    dungeonConfig.dungeonCharacterConfig[idx].entity.id = uuidv4();
                }
            }
        }
    }

    private assignConfigRequired(config: DataConfig) {
        for (var dungeonIdx = 0; dungeonIdx < config.dungeonConfig.length; dungeonIdx++) {
            const dungeonConfig = config.dungeonConfig[dungeonIdx];
            if (!dungeonConfig.entity.description) {
                dungeonConfig.entity.description = faker.lorem.sentence();
            }

            if (dungeonConfig.dungeonLocationConfig) {
                for (var idx = 0; idx < dungeonConfig.dungeonLocationConfig.length; idx++) {
                    if (!dungeonConfig.dungeonLocationConfig[idx].entity.description) {
                        dungeonConfig.dungeonLocationConfig[idx].entity.description = faker.lorem.sentence();
                    }
                }
            }

            if (dungeonConfig.dungeonCharacterConfig) {
                for (var idx = 0; idx < dungeonConfig.dungeonCharacterConfig.length; idx++) {
                    if (!dungeonConfig.dungeonCharacterConfig[idx].entity.strength) {
                        dungeonConfig.dungeonCharacterConfig[idx].entity.strength = 10;
                    }
                    if (!dungeonConfig.dungeonCharacterConfig[idx].entity.dexterity) {
                        dungeonConfig.dungeonCharacterConfig[idx].entity.dexterity = 10;
                    }
                    if (!dungeonConfig.dungeonCharacterConfig[idx].entity.intelligence) {
                        dungeonConfig.dungeonCharacterConfig[idx].entity.intelligence = 10;
                    }
                }
            }

            if (dungeonConfig.dungeonMonsterConfig) {
                for (var idx = 0; idx < dungeonConfig.dungeonMonsterConfig.length; idx++) {
                    if (!dungeonConfig.dungeonMonsterConfig[idx].entity.strength) {
                        dungeonConfig.dungeonMonsterConfig[idx].entity.strength = 10;
                    }
                    if (!dungeonConfig.dungeonMonsterConfig[idx].entity.dexterity) {
                        dungeonConfig.dungeonMonsterConfig[idx].entity.dexterity = 10;
                    }
                    if (!dungeonConfig.dungeonMonsterConfig[idx].entity.intelligence) {
                        dungeonConfig.dungeonMonsterConfig[idx].entity.intelligence = 10;
                    }
                }
            }

            if (dungeonConfig.dungeonObjectConfig) {
                for (var idx = 0; idx < dungeonConfig.dungeonObjectConfig.length; idx++) {
                    if (!dungeonConfig.dungeonObjectConfig[idx].entity.name) {
                        dungeonConfig.dungeonObjectConfig[idx].entity.name = faker.lorem.word();
                    }
                    if (!dungeonConfig.dungeonObjectConfig[idx].entity.description) {
                        dungeonConfig.dungeonObjectConfig[idx].entity.description = faker.lorem.sentence();
                    }
                    if (!dungeonConfig.dungeonObjectConfig[idx].entity.description_long) {
                        dungeonConfig.dungeonObjectConfig[idx].entity.description_long = faker.lorem.sentence();
                    }
                }
            }
        }
    }

    private resolveConfigDungeonIdentifiers(dungeonConfig: DungeonConfig) {
        if (dungeonConfig.dungeonLocationConfig) {
            for (var idx = 0; idx < dungeonConfig.dungeonLocationConfig.length; idx++) {
                dungeonConfig.dungeonLocationConfig[idx].entity.dungeon_id = dungeonConfig.entity.id;
            }
        }
        if (dungeonConfig.dungeonCharacterConfig) {
            for (var idx = 0; idx < dungeonConfig.dungeonCharacterConfig.length; idx++) {
                dungeonConfig.dungeonCharacterConfig[idx].entity.dungeon_id = dungeonConfig.entity.id;
            }
        }
        if (dungeonConfig.dungeonMonsterConfig) {
            for (var idx = 0; idx < dungeonConfig.dungeonMonsterConfig.length; idx++) {
                dungeonConfig.dungeonMonsterConfig[idx].entity.dungeon_id = dungeonConfig.entity.id;
            }
        }
        if (dungeonConfig.dungeonObjectConfig) {
            for (var idx = 0; idx < dungeonConfig.dungeonObjectConfig.length; idx++) {
                dungeonConfig.dungeonObjectConfig[idx].entity.dungeon_id = dungeonConfig.entity.id;
            }
        }
    }

    private resolveConfigLocationIdentifiers(dungeonConfig: DungeonConfig) {
        const logger = this.loggerService.logger({
            class: 'DataService',
            function: 'resolveConfigLocationIdentifiers',
        });

        // Location direction identifiers
        if (dungeonConfig.dungeonLocationConfig) {
            for (var idx = 0; idx < dungeonConfig.dungeonLocationConfig.length; idx++) {
                if (dungeonConfig.dungeonLocationConfig[idx].north_location_name) {
                    dungeonConfig.dungeonLocationConfig[idx].entity.north_dungeon_location_id =
                        this.getLocationIdentifier(
                            dungeonConfig,
                            dungeonConfig.dungeonLocationConfig[idx].north_location_name,
                        );
                }
                if (dungeonConfig.dungeonLocationConfig[idx].northeast_location_name) {
                    dungeonConfig.dungeonLocationConfig[idx].entity.northeast_dungeon_location_id =
                        this.getLocationIdentifier(
                            dungeonConfig,
                            dungeonConfig.dungeonLocationConfig[idx].northeast_location_name,
                        );
                }
                if (dungeonConfig.dungeonLocationConfig[idx].east_location_name) {
                    dungeonConfig.dungeonLocationConfig[idx].entity.east_dungeon_location_id =
                        this.getLocationIdentifier(
                            dungeonConfig,
                            dungeonConfig.dungeonLocationConfig[idx].east_location_name,
                        );
                }
                if (dungeonConfig.dungeonLocationConfig[idx].southeast_location_name) {
                    dungeonConfig.dungeonLocationConfig[idx].entity.southeast_dungeon_location_id =
                        this.getLocationIdentifier(
                            dungeonConfig,
                            dungeonConfig.dungeonLocationConfig[idx].southeast_location_name,
                        );
                }
                if (dungeonConfig.dungeonLocationConfig[idx].south_location_name) {
                    dungeonConfig.dungeonLocationConfig[idx].entity.south_dungeon_location_id =
                        this.getLocationIdentifier(
                            dungeonConfig,
                            dungeonConfig.dungeonLocationConfig[idx].south_location_name,
                        );
                }
                if (dungeonConfig.dungeonLocationConfig[idx].southwest_location_name) {
                    dungeonConfig.dungeonLocationConfig[idx].entity.southwest_dungeon_location_id =
                        this.getLocationIdentifier(
                            dungeonConfig,
                            dungeonConfig.dungeonLocationConfig[idx].southwest_location_name,
                        );
                }
                if (dungeonConfig.dungeonLocationConfig[idx].west_location_name) {
                    dungeonConfig.dungeonLocationConfig[idx].entity.west_dungeon_location_id =
                        this.getLocationIdentifier(
                            dungeonConfig,
                            dungeonConfig.dungeonLocationConfig[idx].west_location_name,
                        );
                }
                if (dungeonConfig.dungeonLocationConfig[idx].northwest_location_name) {
                    dungeonConfig.dungeonLocationConfig[idx].entity.northwest_dungeon_location_id =
                        this.getLocationIdentifier(
                            dungeonConfig,
                            dungeonConfig.dungeonLocationConfig[idx].northwest_location_name,
                        );
                }
                if (dungeonConfig.dungeonLocationConfig[idx].north_location_name) {
                    dungeonConfig.dungeonLocationConfig[idx].entity.north_dungeon_location_id =
                        this.getLocationIdentifier(
                            dungeonConfig,
                            dungeonConfig.dungeonLocationConfig[idx].north_location_name,
                        );
                }
                if (dungeonConfig.dungeonLocationConfig[idx].up_location_name) {
                    dungeonConfig.dungeonLocationConfig[idx].entity.up_dungeon_location_id = this.getLocationIdentifier(
                        dungeonConfig,
                        dungeonConfig.dungeonLocationConfig[idx].up_location_name,
                    );
                }
                if (dungeonConfig.dungeonLocationConfig[idx].down_location_name) {
                    dungeonConfig.dungeonLocationConfig[idx].entity.down_dungeon_location_id =
                        this.getLocationIdentifier(
                            dungeonConfig,
                            dungeonConfig.dungeonLocationConfig[idx].down_location_name,
                        );
                }
            }
        }

        // Character location identifiers
        if (dungeonConfig.dungeonCharacterConfig) {
            for (var idx = 0; idx < dungeonConfig.dungeonCharacterConfig.length; idx++) {
                logger.info(
                    `Fetching location for dungeon character ${dungeonConfig.dungeonCharacterConfig[idx].entity.name} location ${dungeonConfig.dungeonCharacterConfig[idx].location_name}`,
                );
                dungeonConfig.dungeonCharacterConfig[idx].entity.dungeon_location_id = this.getLocationIdentifier(
                    dungeonConfig,
                    dungeonConfig.dungeonCharacterConfig[idx].location_name,
                );
            }
        }

        // Monster location identifiers
        if (dungeonConfig.dungeonMonsterConfig) {
            for (var idx = 0; idx < dungeonConfig.dungeonMonsterConfig.length; idx++) {
                logger.info(
                    `Fetching location for dungeon monster ${dungeonConfig.dungeonMonsterConfig[idx].entity.name} location ${dungeonConfig.dungeonMonsterConfig[idx].location_name}`,
                );
                dungeonConfig.dungeonMonsterConfig[idx].entity.dungeon_location_id = this.getLocationIdentifier(
                    dungeonConfig,
                    dungeonConfig.dungeonMonsterConfig[idx].location_name,
                );
            }
        }

        // Object location identifiers
        if (dungeonConfig.dungeonObjectConfig) {
            for (var idx = 0; idx < dungeonConfig.dungeonObjectConfig.length; idx++) {
                logger.info(
                    `Fetching location for dungeon object ${dungeonConfig.dungeonObjectConfig[idx].entity.name} location ${dungeonConfig.dungeonObjectConfig[idx].location_name}`,
                );
                dungeonConfig.dungeonObjectConfig[idx].entity.dungeon_location_id = this.getLocationIdentifier(
                    dungeonConfig,
                    dungeonConfig.dungeonObjectConfig[idx].location_name,
                );
            }
        }
    }
}
