export interface CreateDungeonEntity {
    id?: string;
    name: string;
    description: string;
}

export interface UpdateDungeonEntity {
    id: string;
    name: string;
    description: string;
}

export interface DungeonEntity {
    id: string;
    name: string;
    description: string;
    created_at: Date;
    updated_at?: Date;
}
