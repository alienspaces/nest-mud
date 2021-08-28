import * as crypto from 'crypto';

// Application
import {
    DungeonEntity,
    DungeonLocationEntity,
    DungeonCharacterEntity,
    DungeonMonsterEntity,
    DungeonObjectEntity,
} from '@/services';

export interface DungeonConfig {
    entity: Partial<DungeonEntity> & Required<Pick<DungeonEntity, 'name'>>;
    defaultDungeonLocationName: string;
    dungeonLocationConfig?: DungeonLocationConfig[];
    dungeonCharacterConfig?: DungeonCharacterConfig[];
    dungeonMonsterConfig?: DungeonMonsterConfig[];
    dungeonObjectConfig?: DungeonObjectConfig[];
}

export interface DungeonLocationConfig {
    entity: Partial<DungeonLocationEntity> & Required<Pick<DungeonLocationEntity, 'name'>>;
    north_location_name?: string;
    northeast_location_name?: string;
    east_location_name?: string;
    southeast_location_name?: string;
    south_location_name?: string;
    southwest_location_name?: string;
    west_location_name?: string;
    northwest_location_name?: string;
    up_location_name?: string;
    down_location_name?: string;
}

export interface DungeonCharacterConfig {
    entity: Partial<DungeonCharacterEntity>;
    location_name: string;
}

export interface DungeonMonsterConfig {
    entity: Partial<DungeonMonsterEntity>;
    location_name: string;
}

export interface DungeonObjectConfig {
    entity: Partial<DungeonObjectEntity>;
    location_name: string;
}

export interface DataConfig {
    dungeonConfig?: DungeonConfig[];
}

export function defaultDataConfig(): DataConfig {
    return {
        dungeonConfig: [
            {
                entity: {
                    name: 'Cave',
                },
                defaultDungeonLocationName: 'Cave Entrance',
                dungeonLocationConfig: [
                    {
                        entity: {
                            name: 'Cave Entrance',
                            description: 'A large cave entrance.',
                        },
                        north_location_name: 'Cave Tunnel',
                    },
                    {
                        entity: {
                            name: 'Cave Tunnel',
                            description: 'A cave tunnel descends into the mountain.',
                        },
                        north_location_name: 'Cave Room',
                        south_location_name: 'Cave Entrance',
                    },
                    {
                        entity: {
                            name: 'Cave Room',
                            description: 'A large cave room.',
                        },
                        south_location_name: 'Cave Tunnel',
                    },
                ],
                dungeonCharacterConfig: [
                    {
                        entity: {
                            name: 'Hero ' + crypto.randomUUID(),
                        },
                        location_name: 'Cave Entrance',
                    },
                ],
                dungeonMonsterConfig: [
                    {
                        entity: {
                            name: 'Kobold ' + crypto.randomUUID(),
                        },
                        location_name: 'Cave Tunnel',
                    },
                ],
                dungeonObjectConfig: [
                    {
                        entity: {
                            name: 'Sword ' + crypto.randomUUID(),
                        },
                        location_name: 'Cave Room',
                    },
                ],
            },
        ],
    };
}
