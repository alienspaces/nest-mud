export class DungeonActionDto {
    data: {
        // The action that occurred
        action: {
            id: string;
            dungeon_id: string;
            dungeon_location_id: string;
            dungeon_character_id?: string;
            dungeon_monster_id?: string;
            command: string;
            command_result: string;
            equipped_dungeon_object_name?: string;
            stashed_dungeon_object_name?: string;
            target_dungeon_object_name?: string;
            target_dungeon_character_name?: string;
            target_dungeon_monster_name?: string;
            target_dungeon_location_direction?: string;
            target_dungeon_location_name?: string;
            created_at: Date;
            updated_at?: Date;
        };
        // The character that performed the action
        character?: {
            //
        };
        // The monster that performed the action
        monster?: {
            //
        };
        // The location the action occurred
        location: {
            //
        };
        // Characters at the location
        characters: {
            //
        }[];
        // Monsters at the location
        monsters: {
            //
        }[];
        // Objects at the location
        objects: {
            //
        }[];
    }[];
}
