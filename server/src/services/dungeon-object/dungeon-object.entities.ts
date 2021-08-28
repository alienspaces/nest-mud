export interface CreateDungeonObjectEntity {
    id?: string;
    dungeon_id: string;
    dungeon_location_id?: string;
    dungeon_character_id?: string;
    dungeon_monster_id?: string;
    name: string;
    description: string;
    description_long: string;
    is_stashed?: boolean;
    is_equipped?: boolean;
}

export interface UpdateDungeonObjectEntity {
    id: string;
    dungeon_id: string;
    name: string;
}

export interface DungeonObjectEntity {
    id?: string;
    dungeon_id: string;
    dungeon_location_id?: string;
    dungeon_character_id?: string;
    dungeon_monster_id?: string;
    name: string;
    description: string;
    description_long: string;
    is_stashed?: boolean;
    is_equipped?: boolean;
    created_at: Date;
    updated_at?: Date;
}
