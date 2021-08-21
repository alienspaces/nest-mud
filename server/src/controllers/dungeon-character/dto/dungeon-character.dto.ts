export class DungeonCharacterDto {
    data: {
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
        updated_at: Date | null;
    }[];
}
