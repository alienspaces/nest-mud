export interface CreateDungeonEntity {
    id?: string;
    name: string;
    description: string;
}

export interface UpdateDungeonEntity {
    id: string;
    name: string;
    description: string;
}

export interface DungeonEntity {
    id: string;
    name: string;
    description: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export interface CreateDungeonLocationEntity {
    id?: string;
    dungeon_id: string;
    name: string;
    description: string;
    default: boolean;
    north_dungeon_location_id?: string;
    northeast_dungeon_location_id?: string;
    east_dungeon_location_id?: string;
    southeast_dungeon_location_id?: string;
    south_dungeon_location_id?: string;
    southwest_dungeon_location_id?: string;
    west_dungeon_location_id?: string;
    northwest_dungeon_location_id?: string;
    up_dungeon_location_id?: string;
    down_dungeon_location_id?: string;
}

export interface UpdateDungeonLocationEntity {
    id: string;
    dungeon_id: string;
    name: string;
    description: string;
    default: boolean;
    north_dungeon_location_id?: string;
    northeast_dungeon_location_id?: string;
    east_dungeon_location_id?: string;
    southeast_dungeon_location_id?: string;
    south_dungeon_location_id?: string;
    southwest_dungeon_location_id?: string;
    west_dungeon_location_id?: string;
    northwest_dungeon_location_id?: string;
    up_dungeon_location_id?: string;
    down_dungeon_location_id?: string;
}

export interface DungeonLocationEntity {
    id: string;
    dungeon_id: string;
    name: string;
    description: string;
    default: boolean;
    north_dungeon_location_id?: string;
    northeast_dungeon_location_id?: string;
    east_dungeon_location_id?: string;
    southeast_dungeon_location_id?: string;
    south_dungeon_location_id?: string;
    southwest_dungeon_location_id?: string;
    west_dungeon_location_id?: string;
    northwest_dungeon_location_id?: string;
    up_dungeon_location_id?: string;
    down_dungeon_location_id?: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}
