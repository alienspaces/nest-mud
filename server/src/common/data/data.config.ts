import {
    CharacterEntity,
    DungeonEntity,
    DungeonLocationEntity,
} from '@/services';

export interface DungeonConfig {
    entity: Partial<DungeonEntity> & Required<Pick<DungeonEntity, 'name'>>;
    defaultDungeonLocationName: string;
    dungeonLocationConfig?: DungeonLocationConfig[];
    dungeonCharacterConfig?: CharacterConfig[];
}

export interface DungeonLocationConfig {
    entity: Partial<DungeonLocationEntity> &
        Required<Pick<DungeonLocationEntity, 'name'>>;
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

export interface CharacterConfig {
    entity: Partial<CharacterEntity>;
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
                            description:
                                'A cave tunnel descends into the mountain.',
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
                            name: 'Hero',
                        },
                        location_name: 'Cave Entrance',
                    },
                ],
            },
        ],
    };
}
