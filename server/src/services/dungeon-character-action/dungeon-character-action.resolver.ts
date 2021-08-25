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
    character: DungeonCharacterRepositoryRecord;
    location: DungeonLocationRepositoryRecord;
    characters?: DungeonCharacterRepositoryRecord[];
    monsters?: DungeonMonsterRepositoryRecord[];
    objects?: DungeonObjectRepositoryRecord[];
}

interface ResolverSentence {
    command?: string;
    words?: string[];
}

export class DungeonCharacterActionResolver {
    resolveAction(
        sentence: string,
        records: ResolverRecords,
    ): DungeonCharacterActionRepositoryRecord {
        const resolved = this.resolveCommand(sentence);

        const resolveFuncs = {
            move: this.resolveMoveAction,
            look: this.resolveLookAction,
            equip: this.resolveEquipAction,
            stash: this.resolveStashAction,
            drop: this.resolveDropAction,
        };

        let dungeonCharacterActionRecord: Partial<DungeonCharacterActionRepositoryRecord> =
            {
                dungeon_id: records.character.dungeon_id,
                dungeon_location_id: records.character.dungeon_location_id,
                dungeon_character_id: records.character.id,
            };

        resolveFuncs[resolved.command](
            dungeonCharacterActionRecord,
            resolved.words,
            records,
        );

        return dungeonCharacterActionRecord as DungeonCharacterActionRepositoryRecord;
    }

    resolveCommand(sentence: string): ResolverSentence {
        const parts = sentence.split(' ');
        let resolved: ResolverSentence = {};

        ['move', 'look', 'equip', 'stash', 'drop'].some((findAction) => {
            const index = parts.indexOf(findAction);
            if (index === -1) {
                return;
            }
            resolved = {
                command: findAction,
                words:
                    parts.length > index + 1
                        ? parts.splice(index + 1)
                        : undefined,
            };
            return true;
        });
        return resolved;
    }

    resolveMoveAction(
        dungeonCharacterActionRecord: DungeonCharacterActionRepositoryRecord,
        words: string[],
        records: ResolverRecords,
    ): DungeonCharacterActionRepositoryRecord {
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
                dungeonCharacterActionRecord.target_dungeon_location_id =
                    records.location[prop];
                dungeonCharacterActionRecord.action += ` ${directionMap[prop]}`;
            }
        }

        return null;
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
