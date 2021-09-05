export interface CreateDungeonMonsterEntity {
    id?: string;
    dungeon_id: string;
    dungeon_location_id: string;
    name: string;
    strength: number;
    dexterity: number;
    intelligence: number;
}

export interface UpdateDungeonMonsterEntity {
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
}

export interface DungeonMonsterEntity {
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
    created_at: Date;
    updated_at?: Date;
}
