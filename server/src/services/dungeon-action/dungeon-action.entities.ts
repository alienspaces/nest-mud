import { DungeonLocationEntity, DungeonCharacterEntity, DungeonMonsterEntity, DungeonObjectEntity } from '@/services';

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

/*
 * The result of a dungeon action
 */
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

/*
 * A complete record set of a resulting dungeon action event
 */
export interface DungeonActionEntitySet {
    dungeonActionEntity: DungeonActionEntity;
    dungeonLocationEntity: DungeonLocationEntity;
    dungeonCharacterEntity?: DungeonCharacterEntity;
    dungeonMonsterEntity?: DungeonMonsterEntity;
    dungeonCharacterEntities?: DungeonCharacterEntity[];
    dungeonMonsterEntities?: DungeonMonsterEntity[];
    dungeonObjectEntities?: DungeonObjectEntity[];
}
