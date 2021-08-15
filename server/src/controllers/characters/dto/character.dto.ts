export class CharacterDto {
    data: {
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
    }[];
}
