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

/*
 * A dungeon location record set contains all records
 * related to a dungeon location. This record set is
 * used to process character and monster actions.
 */
export interface DungeonLocationRecordSet {
    character: DungeonCharacterRepositoryRecord;
    location: DungeonLocationRepositoryRecord;
    characters?: DungeonCharacterRepositoryRecord[];
    monsters?: DungeonMonsterRepositoryRecord[];
    objects?: DungeonObjectRepositoryRecord[];
    locations?: DungeonLocationRepositoryRecord[];
}

/*
 * A dungeon action event record set contains all records
 * related to a dungeon event. This record set is used to
 * create event entity sets that are then used to build
 * character action responses.
 */
export interface DungeonActionEventRecordSet {
    dungeonActionRecord: DungeonActionRepositoryRecord;
    dungeonActionCharacterRecords?: DungeonActionCharacterRepositoryRecord[];
    dungeonActionMonsterRecords?: DungeonActionMonsterRepositoryRecord[];
    dungeonActionObjectRecords?: DungeonActionObjectRepositoryRecord[];
}
