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
    coin: number;
    experience: number;
}

export interface DungeonCharacterEntity {
    id: string;
    dungeon_id: string;
    dungeon_location_id: string;
    name: string;
    strength: number;
    dexterity: number;
    intelligence: number;
    coin: number;
    experience: number;
    created_at: Date;
    updated_at: Date | null;
    deleted_at: Date | null;
}
