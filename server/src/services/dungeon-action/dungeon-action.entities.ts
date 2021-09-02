export interface CreateDungeonActionEntity {
    dungeon_id: string;
    dungeon_location_id: string;
    dungeon_character_id?: string;
    dungeon_monster_id?: string;
    resolved_command: 'move' | 'look' | 'equip' | 'stash' | 'drop';
    resolved_equipped_dungeon_object_name?: string;
    resolved_equipped_dungeon_object_id?: string;
    resolved_stashed_dungeon_object_name?: string;
    resolved_stashed_dungeon_object_id?: string;
    resolved_target_dungeon_object_name?: string;
    resolved_target_dungeon_object_id?: string;
    resolved_target_dungeon_character_name?: string;
    resolved_target_dungeon_character_id?: string;
    resolved_target_dungeon_monster_name?: string;
    resolved_target_dungeon_monster_id?: string;
    resolved_target_dungeon_location_direction?: string;
    resolved_target_dungeon_location_name?: string;
    resolved_target_dungeon_location_id?: string;
}

export interface DungeonActionEntitySet {
    dungeonActionEntity: DungeonActionEntity;
    dungeonLocationEntity: DungeonActionLocationEntity;
    dungeonCharacterEntity: DungeonActionCharacterEntity;
    dungeonMonsterEntity: DungeonActionMonsterEntity;
    dungeonActionCharacterEntities: DungeonActionCharacterEntity[];
    dungeonActionMonsterEntities?: DungeonActionMonsterEntity[];
    dungeonActionObjectEntities?: DungeonActionObjectEntity[];
}

export interface DungeonActionEntity {
    id: string;
    dungeon_id: string;
    dungeon_location_id: string;
    dungeon_character_id?: string;
    dungeon_monster_id?: string;
    serial_id: number;
    resolved_command: 'move' | 'look' | 'equip' | 'stash' | 'drop';
    resolved_equipped_dungeon_object_name?: string;
    resolved_equipped_dungeon_object_id?: string;
    resolved_stashed_dungeon_object_name?: string;
    resolved_stashed_dungeon_object_id?: string;
    resolved_target_dungeon_object_name?: string;
    resolved_target_dungeon_object_id?: string;
    resolved_target_dungeon_character_name?: string;
    resolved_target_dungeon_character_id?: string;
    resolved_target_dungeon_monster_name?: string;
    resolved_target_dungeon_monster_id?: string;
    resolved_target_dungeon_location_direction?: string;
    resolved_target_dungeon_location_name?: string;
    resolved_target_dungeon_location_id?: string;
    created_at: Date;
    updated_at?: Date;
}

export interface DungeonActionLocationEntity {
    id: string;
    dungeon_action_id: string;
    dungeon_character_id: string;
    created_at: Date;
    updated_at?: Date;
}

export interface DungeonActionCharacterEntity {
    id: string;
    dungeon_action_id: string;
    dungeon_character_id: string;
    created_at: Date;
    updated_at?: Date;
}

export interface DungeonActionMonsterEntity {
    id: string;
    dungeon_action_id: string;
    dungeon_monster_id: string;
    created_at: Date;
    updated_at?: Date;
}

export interface DungeonActionObjectEntity {
    id: string;
    dungeon_action_id: string;
    dungeon_object_id: string;
    created_at: Date;
    updated_at?: Date;
}
