export class DungeonLocationDto {
    data: {
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
        created_at: Date;
        updated_at?: Date;
    }[];
}
