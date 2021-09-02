import {
    DungeonCharacterRepositoryRecord,
    DungeonLocationRepositoryRecord,
    DungeonMonsterRepositoryRecord,
    DungeonObjectRepositoryRecord,
    DungeonActionCharacterRepositoryRecord,
    DungeonActionMonsterRepositoryRecord,
    DungeonActionObjectRepositoryRecord,
    DungeonActionRepository,
    DungeonActionRepositoryRecord,
} from '@/repositories';

export const DUNGEON_ACTIONS = ['move', 'look', 'equip', 'stash', 'drop'];

export interface DungeonActionProcessRecordSet {
    character: DungeonCharacterRepositoryRecord;
    location: DungeonLocationRepositoryRecord;
    characters?: DungeonCharacterRepositoryRecord[];
    monsters?: DungeonMonsterRepositoryRecord[];
    objects?: DungeonObjectRepositoryRecord[];
    locations?: DungeonLocationRepositoryRecord[];
}

export interface DungeonActionRecordSet {
    dungeonAction: DungeonActionRepositoryRecord;
    characters?: DungeonActionCharacterRepositoryRecord[];
    monsters?: DungeonActionMonsterRepositoryRecord[];
    objects?: DungeonActionObjectRepositoryRecord[];
}
