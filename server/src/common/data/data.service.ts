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
    CreateLocationEntity,
    LocationEntity,
    LocationService,
} from '@/services';
import { DataConfig, LocationConfig, CharacterConfig } from './data.config';

@Injectable({ scope: Scope.TRANSIENT })
export class DataService {
    characterEntities: CharacterEntity[] = [];
    locationEntities: LocationEntity[] = [];

    constructor(
        private loggerService: LoggerService,
        private databaseService: DatabaseService,
        private locationsService: LocationService,
        private characterService: CharacterService,
    ) {}

    async setup(config: DataConfig) {
        const logger = this.loggerService.logger({
            class: 'DataService',
            function: 'setup',
        });

        logger.info('Setting up');

        this.assignConfigIdentifiers(config);
        this.assignConfigRequired(config);

        for (var idx = 0; idx < config.locationConfig.length; idx++) {
            await this.addLocationEntity(
                config.locationConfig[idx].entity as CreateLocationEntity,
            );
        }

        this.resolveConfigIdentifiers(config);

        for (var idx = 0; idx < config.locationConfig.length; idx++) {
            await this.updateLocationEntity(
                config.locationConfig[idx].entity as LocationEntity,
            );
        }

        for (var idx = 0; idx < config.characterConfig.length; idx++) {
            await this.addCharacterEntity(
                config.characterConfig[idx].entity as CreateCharacterEntity,
            );
        }

        logger.info('Done');
    }

    async teardown() {
        await this.removeCharacterEntities();
        await this.removeLocationEntities();
    }

    private async addLocationEntity(
        location: CreateLocationEntity,
    ): Promise<LocationEntity[]> {
        const locationEntity = await this.locationsService.createLocation(
            location,
        );
        this.locationEntities.push(locationEntity);
        return;
    }

    private async updateLocationEntity(
        location: LocationEntity,
    ): Promise<LocationEntity[]> {
        const logger = this.loggerService.logger({
            class: 'DataService',
            function: 'updateLocationEntity',
        });
        logger.info(location);
        await this.locationsService.updateLocation(location);
        return;
    }

    private async addCharacterEntity(
        character: CreateCharacterEntity,
    ): Promise<CharacterEntity[]> {
        const characterEntity = await this.characterService.createCharacter(
            character,
        );
        this.characterEntities.push(characterEntity);
        return;
    }

    private async removeLocationEntities() {
        const logger = this.loggerService.logger({
            class: 'DataService',
            function: 'removeLocationEntities',
        });

        const client = await this.databaseService.connect();
        const locationIds = this.locationEntities.map(
            (locationEntity) => `'${locationEntity.id}'`,
        );
        const sql = `DELETE FROM location WHERE id IN (${locationIds.join(
            ',',
        )});`;
        logger.info(sql);

        await client.query(sql);
        await this.databaseService.end();
        this.locationEntities = [];
    }

    private async removeCharacterEntities() {
        const logger = this.loggerService.logger({
            class: 'DataService',
            function: 'removeCharacterEntities',
        });
        const client = await this.databaseService.connect();
        const characterIds = this.characterEntities.map(
            (characterEntity) => `'${characterEntity.id}'`,
        );
        const sql = `DELETE FROM character WHERE id IN (${characterIds.join(
            ',',
        )});`;
        logger.info(sql);

        await client.query(sql);
        await this.databaseService.end();
        this.characterEntities = [];
    }

    private getLocationIdentifier(config: DataConfig, name: string): string {
        const logger = this.loggerService.logger({
            class: 'DataService',
            function: 'getLocationIdentifier',
        });
        for (var idx = 0; idx < config.locationConfig.length; idx++) {
            if (config.locationConfig[idx].entity.name === name) {
                logger.info(
                    `Returning >${config.locationConfig[idx].entity.id}< for >${name}<`,
                );
                return config.locationConfig[idx].entity.id;
            }
        }
        return;
    }

    private assignConfigIdentifiers(config: DataConfig) {
        for (var idx = 0; idx < config.locationConfig.length; idx++) {
            if (!config.locationConfig[idx].entity.id) {
                config.locationConfig[idx].entity.id = uuidv4();
            }
        }
        for (var idx = 0; idx < config.characterConfig.length; idx++) {
            if (!config.characterConfig[idx].entity.id) {
                config.characterConfig[idx].entity.id = uuidv4();
            }
        }
    }

    private assignConfigRequired(config: DataConfig) {
        for (var idx = 0; idx < config.locationConfig.length; idx++) {
            if (!config.locationConfig[idx].entity.description) {
                config.locationConfig[idx].entity.description =
                    faker.lorem.sentence();
            }
        }
        for (var idx = 0; idx < config.characterConfig.length; idx++) {
            if (!config.characterConfig[idx].entity.strength) {
                config.characterConfig[idx].entity.strength = 10;
            }
            if (!config.characterConfig[idx].entity.dexterity) {
                config.characterConfig[idx].entity.dexterity = 10;
            }
            if (!config.characterConfig[idx].entity.intelligence) {
                config.characterConfig[idx].entity.intelligence = 10;
            }
        }
    }

    private resolveConfigIdentifiers(config: DataConfig) {
        // Location direction identifiers
        for (var idx = 0; idx < config.locationConfig.length; idx++) {
            if (config.locationConfig[idx].north_location_name) {
                config.locationConfig[idx].entity.north_location_id =
                    this.getLocationIdentifier(
                        config,
                        config.locationConfig[idx].north_location_name,
                    );
            }
            if (config.locationConfig[idx].northeast_location_name) {
                config.locationConfig[idx].entity.northeast_location_id =
                    this.getLocationIdentifier(
                        config,
                        config.locationConfig[idx].northeast_location_name,
                    );
            }
            if (config.locationConfig[idx].east_location_name) {
                config.locationConfig[idx].entity.east_location_id =
                    this.getLocationIdentifier(
                        config,
                        config.locationConfig[idx].east_location_name,
                    );
            }
            if (config.locationConfig[idx].southeast_location_name) {
                config.locationConfig[idx].entity.southeast_location_id =
                    this.getLocationIdentifier(
                        config,
                        config.locationConfig[idx].southeast_location_name,
                    );
            }
            if (config.locationConfig[idx].south_location_name) {
                config.locationConfig[idx].entity.south_location_id =
                    this.getLocationIdentifier(
                        config,
                        config.locationConfig[idx].south_location_name,
                    );
            }
            if (config.locationConfig[idx].southwest_location_name) {
                config.locationConfig[idx].entity.southwest_location_id =
                    this.getLocationIdentifier(
                        config,
                        config.locationConfig[idx].southwest_location_name,
                    );
            }
            if (config.locationConfig[idx].west_location_name) {
                config.locationConfig[idx].entity.west_location_id =
                    this.getLocationIdentifier(
                        config,
                        config.locationConfig[idx].west_location_name,
                    );
            }
            if (config.locationConfig[idx].northwest_location_name) {
                config.locationConfig[idx].entity.northwest_location_id =
                    this.getLocationIdentifier(
                        config,
                        config.locationConfig[idx].northwest_location_name,
                    );
            }
            if (config.locationConfig[idx].north_location_name) {
                config.locationConfig[idx].entity.north_location_id =
                    this.getLocationIdentifier(
                        config,
                        config.locationConfig[idx].north_location_name,
                    );
            }
            if (config.locationConfig[idx].up_location_name) {
                config.locationConfig[idx].entity.up_location_id =
                    this.getLocationIdentifier(
                        config,
                        config.locationConfig[idx].up_location_name,
                    );
            }
            if (config.locationConfig[idx].down_location_name) {
                config.locationConfig[idx].entity.down_location_id =
                    this.getLocationIdentifier(
                        config,
                        config.locationConfig[idx].down_location_name,
                    );
            }
        }

        // Character location identifiers
        for (var idx = 0; idx < config.characterConfig.length; idx++) {
            config.characterConfig[idx].entity.location_id =
                this.getLocationIdentifier(
                    config,
                    config.characterConfig[idx].location_name,
                );
        }
    }
}
