import { CharacterEntity, LocationEntity } from '@/services';

export interface LocationConfig {
    entity: Partial<LocationEntity> & Required<Pick<LocationEntity, 'name'>>;
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
    locationConfig?: LocationConfig[];
    characterConfig?: CharacterConfig[];
}

export const defaultDataConfig: DataConfig = {
    locationConfig: [
        {
            entity: {
                name: 'Cave Entrance',
                description: 'A large cave entrance.',
                default: true,
            },
            north_location_name: 'Cave Tunnel',
        },
        {
            entity: {
                name: 'Cave Tunnel',
                description: 'A cave tunnel descends into the mountain.',
                default: false,
            },
            north_location_name: 'Cave Room',
            south_location_name: 'Cave Entrance',
        },
        {
            entity: {
                name: 'Cave Room',
                description: 'A large cave room.',
                default: false,
            },
            south_location_name: 'Cave Tunnel',
        },
    ],
    characterConfig: [
        {
            entity: {
                name: 'Hero',
            },
            location_name: 'Cave Entrance',
        },
    ],
};
