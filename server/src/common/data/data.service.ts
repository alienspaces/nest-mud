import { Injectable, Scope } from '@nestjs/common';
// import { v5 as uuidv5 } from 'uuid';
import { v4 as uuidv4 } from 'uuid';
import * as faker from 'faker';

// Application
import { LoggerService, DatabaseService } from '@/core';
import {
    CreateCharacterEntity,
    CharacterEntity,
    CharacterService,
    CreateDungeonEntity,
    DungeonEntity,
    CreateDungeonLocationEntity,
    DungeonLocationEntity,
    DungeonService,
} from '@/services';
import { DataConfig, DungeonConfig } from './data.config';

export class Data {
    dungeonEntities: DungeonEntity[] = [];
    dungeonLocationEntities: DungeonLocationEntity[] = [];
    characterEntities: CharacterEntity[] = [];

    private _dungeonTeardownIds: string[] = [];
    private _dungeonLocationTeardownIds: string[] = [];
    private _characterTeardownIds: string[] = [];

    constructor() {
        this.characterEntities = [];
        this._characterTeardownIds = [];
        this.dungeonEntities = [];
        this._dungeonTeardownIds = [];
        this.dungeonLocationEntities = [];
        this._dungeonLocationTeardownIds = [];
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

    clearDungeonEntities() {
        this.dungeonEntities = [];
        this._dungeonTeardownIds = [];
    }

    clearDungeonLocationEntities() {
        this.dungeonLocationEntities = [];
        this._dungeonLocationTeardownIds = [];
    }

    clearCharacterEntities() {
        this.characterEntities = [];
        this._characterTeardownIds = [];
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
}

@Injectable({ scope: Scope.TRANSIENT })
export class DataService {
    private instanceId: string;

    constructor(
        private loggerService: LoggerService,
        private databaseService: DatabaseService,
        private dungeonService: DungeonService,
        private characterService: CharacterService,
    ) {
        this.instanceId = uuidv4();
    }

    async setup(config: DataConfig, data: Data) {
        const logger = this.loggerService.logger({
            class: 'DataService',
            function: 'setup',
        });

        logger.debug(`Setting up >${this.instanceId}<`);

        // Assign identifiers to all entities
        this.assignConfigIdentifiers(config);

        // Update all identities with missing required properties
        this.assignConfigRequired(config);

        for (var idx = 0; idx < config.dungeonConfig.length; idx++) {
            const dungeonConfig = config.dungeonConfig[idx];

            // Dungeon entity
            await this.addDungeonEntity(
                data,
                dungeonConfig.entity as CreateDungeonEntity,
            );

            // Resolve all dungeon identifiers on entities where entity
            // configuration references a dungeon by name
            this.resolveConfigDungeonIdentifiers(dungeonConfig);

            // Add dungeon location entities
            for (
                var idx = 0;
                idx < dungeonConfig.dungeonLocationConfig.length;
                idx++
            ) {
                // Assign default location
                if (
                    dungeonConfig.dungeonLocationConfig[idx].entity.name ==
                    dungeonConfig.defaultDungeonLocationName
                ) {
                    dungeonConfig.dungeonLocationConfig[idx].entity.default =
                        true;
                } else {
                    dungeonConfig.dungeonLocationConfig[idx].entity.default =
                        false;
                }

                await this.addDungeonLocationEntity(
                    data,
                    dungeonConfig.dungeonLocationConfig[idx]
                        .entity as CreateDungeonLocationEntity,
                );
            }

            // Resolve all location identifiers on entities where entity
            // configuration references a location by name
            this.resolveConfigLocationIdentifiers(dungeonConfig);

            // Update dungeon location entities
            for (
                var idx = 0;
                idx < dungeonConfig.dungeonLocationConfig.length;
                idx++
            ) {
                await this.updateDungeonLocationEntity(
                    dungeonConfig.dungeonLocationConfig[idx]
                        .entity as DungeonLocationEntity,
                );
            }

            // Add character entities
            for (
                var idx = 0;
                idx < dungeonConfig.dungeonCharacterConfig.length;
                idx++
            ) {
                await this.addCharacterEntity(
                    data,
                    dungeonConfig.dungeonCharacterConfig[idx]
                        .entity as CreateCharacterEntity,
                );
            }
        }

        logger.debug('Done');
    }

    async teardown(data: Data) {
        await this.removeCharacterEntities(data);
        await this.removeDungeonLocationEntities(data);
        await this.removeDungeonEntities(data);
    }

    private async addDungeonEntity(
        data: Data,
        dungeon: CreateDungeonEntity,
    ): Promise<DungeonEntity[]> {
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
        const locationEntity = await this.dungeonService.createDungeonLocation(
            location,
        );
        data.dungeonLocationEntities.push(locationEntity);
        data.addDungeonLocationTeardownId(locationEntity.id);
        return;
    }

    private async updateDungeonLocationEntity(
        location: DungeonLocationEntity,
    ): Promise<DungeonLocationEntity[]> {
        const logger = this.loggerService.logger({
            class: 'DataService',
            function: 'updateDungeonLocationEntity',
        });
        logger.debug(location);
        await this.dungeonService.updateDungeonLocation(location);
        return;
    }

    private async addCharacterEntity(
        data: Data,
        character: CreateCharacterEntity,
    ): Promise<CharacterEntity[]> {
        const logger = this.loggerService.logger({
            class: 'DataService',
            function: 'addCharacterEntity',
        });
        logger.debug(character);
        const characterEntity = await this.characterService.createCharacter(
            character,
        );
        data.characterEntities.push(characterEntity);
        data.addCharacterTeardownId(characterEntity.id);
        return;
    }

    private async removeDungeonEntities(data: Data) {
        const logger = this.loggerService.logger({
            class: 'DataService',
            function: 'removeDungeonEntities',
        });

        const client = await this.databaseService.connect();
        const sql = `DELETE FROM dungeon WHERE id IN (${data
            .getDungeonTeardownIds()
            .join(',')});`;
        logger.debug(sql);

        try {
            await client.query(sql);
        } catch (e) {
            logger.error(e);
            await this.databaseService.end();
        }
        await this.databaseService.end();

        data.clearDungeonEntities();
    }

    private async removeDungeonLocationEntities(data: Data) {
        const logger = this.loggerService.logger({
            class: 'DataService',
            function: 'removeLocationEntities',
        });

        const client = await this.databaseService.connect();
        const sql = `DELETE FROM dungeon_location WHERE id IN (${data
            .getDungeonLocationTeardownIds()
            .join(',')});`;
        logger.debug(sql);

        try {
            await client.query(sql);
        } catch (e) {
            logger.error(e);
            await this.databaseService.end();
        }
        await this.databaseService.end();

        data.clearDungeonLocationEntities();
    }

    private async removeCharacterEntities(data: Data) {
        const logger = this.loggerService.logger({
            class: 'DataService',
            function: 'removeCharacterEntities',
        });
        const client = await this.databaseService.connect();
        const sql = `DELETE FROM character WHERE id IN (${data
            .getCharacterTeardownIds()
            .join(',')});`;
        logger.debug(sql);

        try {
            await client.query(sql);
        } catch (e) {
            logger.error(e);
            await this.databaseService.end();
        }
        await this.databaseService.end();

        data.clearCharacterEntities();
    }

    private getLocationIdentifier(
        dungeonConfig: DungeonConfig,
        name: string,
    ): string {
        const logger = this.loggerService.logger({
            class: 'DataService',
            function: 'getLocationIdentifier',
        });
        for (
            var idx = 0;
            idx < dungeonConfig.dungeonLocationConfig.length;
            idx++
        ) {
            if (dungeonConfig.dungeonLocationConfig[idx].entity.name === name) {
                logger.debug(
                    `Returning >${dungeonConfig.dungeonLocationConfig[idx].entity.id}< for >${name}<`,
                );
                return dungeonConfig.dungeonLocationConfig[idx].entity.id;
            }
        }
        return;
    }

    private assignConfigIdentifiers(config: DataConfig) {
        for (
            var dungeonIdx = 0;
            dungeonIdx < config.dungeonConfig.length;
            dungeonIdx++
        ) {
            const dungeonConfig = config.dungeonConfig[dungeonIdx];
            if (!dungeonConfig.entity.id) {
                dungeonConfig.entity.id = uuidv4();
            }

            for (
                var idx = 0;
                idx < dungeonConfig.dungeonLocationConfig.length;
                idx++
            ) {
                if (!dungeonConfig.dungeonLocationConfig[idx].entity.id) {
                    dungeonConfig.dungeonLocationConfig[idx].entity.id =
                        uuidv4();
                }
            }
            for (
                var idx = 0;
                idx < dungeonConfig.dungeonCharacterConfig.length;
                idx++
            ) {
                if (!dungeonConfig.dungeonCharacterConfig[idx].entity.id) {
                    dungeonConfig.dungeonCharacterConfig[idx].entity.id =
                        uuidv4();
                }
            }
        }
    }

    private assignConfigRequired(config: DataConfig) {
        for (
            var dungeonIdx = 0;
            dungeonIdx < config.dungeonConfig.length;
            dungeonIdx++
        ) {
            const dungeonConfig = config.dungeonConfig[dungeonIdx];
            if (!dungeonConfig.entity.description) {
                dungeonConfig.entity.description = faker.lorem.sentence();
            }

            for (
                var idx = 0;
                idx < dungeonConfig.dungeonLocationConfig.length;
                idx++
            ) {
                if (
                    !dungeonConfig.dungeonLocationConfig[idx].entity.description
                ) {
                    dungeonConfig.dungeonLocationConfig[
                        idx
                    ].entity.description = faker.lorem.sentence();
                }
            }
            for (
                var idx = 0;
                idx < dungeonConfig.dungeonCharacterConfig.length;
                idx++
            ) {
                if (
                    !dungeonConfig.dungeonCharacterConfig[idx].entity.strength
                ) {
                    dungeonConfig.dungeonCharacterConfig[
                        idx
                    ].entity.strength = 10;
                }
                if (
                    !dungeonConfig.dungeonCharacterConfig[idx].entity.dexterity
                ) {
                    dungeonConfig.dungeonCharacterConfig[
                        idx
                    ].entity.dexterity = 10;
                }
                if (
                    !dungeonConfig.dungeonCharacterConfig[idx].entity
                        .intelligence
                ) {
                    dungeonConfig.dungeonCharacterConfig[
                        idx
                    ].entity.intelligence = 10;
                }
            }
        }
    }

    private resolveConfigDungeonIdentifiers(dungeonConfig: DungeonConfig) {
        // Dungeon identifiers
        for (
            var idx = 0;
            idx < dungeonConfig.dungeonLocationConfig.length;
            idx++
        ) {
            dungeonConfig.dungeonLocationConfig[idx].entity.dungeon_id =
                dungeonConfig.entity.id;
        }
        for (
            var idx = 0;
            idx < dungeonConfig.dungeonCharacterConfig.length;
            idx++
        ) {
            dungeonConfig.dungeonCharacterConfig[idx].entity.dungeon_id =
                dungeonConfig.entity.id;
        }
    }

    private resolveConfigLocationIdentifiers(dungeonConfig: DungeonConfig) {
        // Location direction identifiers
        for (
            var idx = 0;
            idx < dungeonConfig.dungeonLocationConfig.length;
            idx++
        ) {
            if (dungeonConfig.dungeonLocationConfig[idx].north_location_name) {
                dungeonConfig.dungeonLocationConfig[
                    idx
                ].entity.north_dungeon_location_id = this.getLocationIdentifier(
                    dungeonConfig,
                    dungeonConfig.dungeonLocationConfig[idx]
                        .north_location_name,
                );
            }
            if (
                dungeonConfig.dungeonLocationConfig[idx].northeast_location_name
            ) {
                dungeonConfig.dungeonLocationConfig[
                    idx
                ].entity.northeast_dungeon_location_id = this.getLocationIdentifier(
                    dungeonConfig,
                    dungeonConfig.dungeonLocationConfig[idx]
                        .northeast_location_name,
                );
            }
            if (dungeonConfig.dungeonLocationConfig[idx].east_location_name) {
                dungeonConfig.dungeonLocationConfig[
                    idx
                ].entity.east_dungeon_location_id = this.getLocationIdentifier(
                    dungeonConfig,
                    dungeonConfig.dungeonLocationConfig[idx].east_location_name,
                );
            }
            if (
                dungeonConfig.dungeonLocationConfig[idx].southeast_location_name
            ) {
                dungeonConfig.dungeonLocationConfig[
                    idx
                ].entity.southeast_dungeon_location_id = this.getLocationIdentifier(
                    dungeonConfig,
                    dungeonConfig.dungeonLocationConfig[idx]
                        .southeast_location_name,
                );
            }
            if (dungeonConfig.dungeonLocationConfig[idx].south_location_name) {
                dungeonConfig.dungeonLocationConfig[
                    idx
                ].entity.south_dungeon_location_id = this.getLocationIdentifier(
                    dungeonConfig,
                    dungeonConfig.dungeonLocationConfig[idx]
                        .south_location_name,
                );
            }
            if (
                dungeonConfig.dungeonLocationConfig[idx].southwest_location_name
            ) {
                dungeonConfig.dungeonLocationConfig[
                    idx
                ].entity.southwest_dungeon_location_id = this.getLocationIdentifier(
                    dungeonConfig,
                    dungeonConfig.dungeonLocationConfig[idx]
                        .southwest_location_name,
                );
            }
            if (dungeonConfig.dungeonLocationConfig[idx].west_location_name) {
                dungeonConfig.dungeonLocationConfig[
                    idx
                ].entity.west_dungeon_location_id = this.getLocationIdentifier(
                    dungeonConfig,
                    dungeonConfig.dungeonLocationConfig[idx].west_location_name,
                );
            }
            if (
                dungeonConfig.dungeonLocationConfig[idx].northwest_location_name
            ) {
                dungeonConfig.dungeonLocationConfig[
                    idx
                ].entity.northwest_dungeon_location_id = this.getLocationIdentifier(
                    dungeonConfig,
                    dungeonConfig.dungeonLocationConfig[idx]
                        .northwest_location_name,
                );
            }
            if (dungeonConfig.dungeonLocationConfig[idx].north_location_name) {
                dungeonConfig.dungeonLocationConfig[
                    idx
                ].entity.north_dungeon_location_id = this.getLocationIdentifier(
                    dungeonConfig,
                    dungeonConfig.dungeonLocationConfig[idx]
                        .north_location_name,
                );
            }
            if (dungeonConfig.dungeonLocationConfig[idx].up_location_name) {
                dungeonConfig.dungeonLocationConfig[
                    idx
                ].entity.up_dungeon_location_id = this.getLocationIdentifier(
                    dungeonConfig,
                    dungeonConfig.dungeonLocationConfig[idx].up_location_name,
                );
            }
            if (dungeonConfig.dungeonLocationConfig[idx].down_location_name) {
                dungeonConfig.dungeonLocationConfig[
                    idx
                ].entity.down_dungeon_location_id = this.getLocationIdentifier(
                    dungeonConfig,
                    dungeonConfig.dungeonLocationConfig[idx].down_location_name,
                );
            }
        }

        // Character location identifiers
        for (
            var idx = 0;
            idx < dungeonConfig.dungeonCharacterConfig.length;
            idx++
        ) {
            dungeonConfig.dungeonCharacterConfig[
                idx
            ].entity.dungeon_location_id = this.getLocationIdentifier(
                dungeonConfig,
                dungeonConfig.dungeonCharacterConfig[idx].location_name,
            );
        }
    }
}
