export class DungeonActionDataDto {
    // The action that occurred
    action: {
        id: string;
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
    };
    // The location the action occurred
    location: {
        name: string;
        description: string;
    };
    // The character that performed the action
    character?: {
        name: string;
    };
    // The monster that performed the action
    monster?: {
        name: string;
    };
    // Characters at the location
    characters: {
        name: string;
    }[];
    // Monsters at the location
    monsters: {
        name: string;
    }[];
    // Objects at the location
    objects: {
        name: string;
    }[];
}

export class DungeonActionDto {
    data: DungeonActionDataDto[];
}
