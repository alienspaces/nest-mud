import {
    DungeonCharacterRepositoryRecord,
    DungeonLocationRepositoryRecord,
    DungeonMonsterRepositoryRecord,
    DungeonObjectRepositoryRecord,
} from '@/repositories';

export const DUNGEON_ACTIONS = ['move', 'look', 'equip', 'stash', 'drop'];

export interface DungeonActionRecords {
    character: DungeonCharacterRepositoryRecord;
    location: DungeonLocationRepositoryRecord;
    characters?: DungeonCharacterRepositoryRecord[];
    monsters?: DungeonMonsterRepositoryRecord[];
    objects?: DungeonObjectRepositoryRecord[];
    locations?: DungeonLocationRepositoryRecord[];
}
