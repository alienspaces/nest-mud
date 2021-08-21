export interface CreateDungeonCharacterActionEntity {
    id?: string;
    character_id: string;
    action: string;
}

export interface DungeonCharacterActionEntity {
    id: string;
    character_id: string;
    action: string;
    created_at: Date;
    updated_at?: Date;
    deleted_at?: Date;
}
