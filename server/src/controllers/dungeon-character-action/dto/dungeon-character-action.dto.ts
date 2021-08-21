export class DungeonCharacterActionDto {
    data: {
        id: string;
        action: string;
        created_at: Date;
        updated_at?: Date;
    }[];
}
