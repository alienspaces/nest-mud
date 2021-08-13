export class CharacterDto {
    data: {
        id: string;
        location_id: string;
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
