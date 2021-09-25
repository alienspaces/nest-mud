export class DungeonDto {
    data: {
        id: string;
        name: string;
        description: string;
        created_at: Date;
        updated_at?: Date;
    }[];
}
