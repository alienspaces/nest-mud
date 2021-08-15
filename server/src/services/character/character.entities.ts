export interface CreateCharacterEntity {
    id?: string;
    dungeon_id: string;
    name: string;
    strength: number;
    dexterity: number;
    intelligence: number;
}

export interface UpdateCharacterEntity {
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

export interface CharacterEntity {
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
