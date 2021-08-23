// Application
import {
    DungeonCharacterRepositoryRecord,
    DungeonLocationRepositoryRecord,
    DungeonMonsterRepositoryRecord,
    DungeonObjectRepositoryRecord,
    DungeonCharacterActionRepositoryRecord,
} from '@/repositories';
import { Resolver } from 'dns';

export interface ResolverRecords {
    action?: DungeonCharacterActionRepositoryRecord;
    character: DungeonCharacterRepositoryRecord;
    location: DungeonLocationRepositoryRecord;
    characters?: DungeonCharacterRepositoryRecord[];
    monsters?: DungeonMonsterRepositoryRecord[];
    objects?: DungeonObjectRepositoryRecord[];
}

interface ResolverSentence {
    action: string;
    words?: string[];
}

export class DungeonCharacterActionResolver {
    resolveAction(sentence: string, records: ResolverRecords) {
        const resolved = this.resolveSentence(sentence);

        const resolveFuncs = {
            move: this.resolveMoveAction,
            look: this.resolveLookAction,
            equip: this.resolveEquipAction,
            stash: this.resolveStashAction,
            drop: this.resolveDropAction,
        };

        records.action = {
            dungeon_id: records.character.dungeon_id,
            dungeon_location_id: records.character.dungeon_location_id,
            dungeon_character_id: records.character.id,
            action: resolved.action,
        };

        resolveFuncs[resolved.action](resolved.words, records);
    }

    resolveSentence(sentence: string): ResolverSentence {
        const parts = sentence.split(' ');
        let resolved: ResolverSentence;

        ['move', 'look', 'equip', 'stash', 'drop'].forEach((findAction) => {
            const index = parts.indexOf(findAction);
            if (index === -1) {
                return;
            }
            resolved.action = findAction;
            resolved.words = parts.splice(index);
        });
        return resolved;
    }

    resolveMoveAction(
        words: string[],
        records: ResolverRecords,
    ): DungeonCharacterActionRepositoryRecord {
        if (!words) {
            // throw?
            return;
        }

        const directionMap = {
            north_dungeon_location_id: 'north',
            northeast_dungeon_location_id: 'northeast',
            east_dungeon_location_id: 'east',
            southeast_dungeon_location_id: 'southeast',
            south_dungeon_location_id: 'south',
            southwest_dungeon_location_id: 'southwest',
            west_dungeon_location_id: 'west',
            northwest_dungeon_location_id: 'northwest',
            up_dungeon_location_id: 'up',
            down_dungeon_location_id: 'down',
        };

        for (var prop in directionMap) {
            if (records.location[prop] && words.indexOf[directionMap[prop]]) {
                records.action.target_dungeon_location_id =
                    records.location[prop];
            }
        }

        return;
    }

    resolveLookAction(
        words: string[],
        records: Resolver,
    ): DungeonCharacterActionRepositoryRecord {
        return null;
    }
    resolveEquipAction(
        words: string[],
        records: Resolver,
    ): DungeonCharacterActionRepositoryRecord {
        return null;
    }
    resolveStashAction(
        words: string[],
        records: Resolver,
    ): DungeonCharacterActionRepositoryRecord {
        return null;
    }
    resolveDropAction(
        words: string[],
        records: Resolver,
    ): DungeonCharacterActionRepositoryRecord {
        return null;
    }
}
