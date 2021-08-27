export interface CreateDungeonCharacterEntity {
    id?: string;
    dungeon_id: string;
    name: string;
    strength: number;
    dexterity: number;
    intelligence: number;
}

export interface UpdateDungeonCharacterEntity {
    id: string;
    name: string;
    dungeon_id: string;
    dungeon_location_id: string;
    strength: number;
    dexterity: number;
    intelligence: number;
    health: number;
    fatigue: number;
    coins: number;
    experience_points: number;
    attribute_points: number;
}

export interface DungeonCharacterEntity {
    id: string;
    dungeon_id: string;
    dungeon_location_id: string;
    name: string;
    strength: number;
    dexterity: number;
    intelligence: number;
    health: number;
    fatigue: number;
    coins: number;
    experience_points: number;
    attribute_points: number;
    created_at: Date;
    updated_at?: Date;
}
