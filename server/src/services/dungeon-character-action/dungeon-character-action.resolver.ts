// Application
import {
    DungeonCharacterRepositoryRecord,
    DungeonLocationRepositoryRecord,
    DungeonMonsterRepositoryRecord,
    DungeonObjectRepositoryRecord,
    DungeonCharacterActionRepositoryRecord,
} from '@/repositories';

export interface ResolverRecords {
    character: DungeonCharacterRepositoryRecord;
    location: DungeonLocationRepositoryRecord;
    characters?: DungeonCharacterRepositoryRecord[];
    monsters?: DungeonMonsterRepositoryRecord[];
    objects?: DungeonObjectRepositoryRecord[];
}

interface ResolverSentence {
    command?: string;
    sentence?: string;
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

        const dungeonCharacterActionRecord = resolveFuncs[resolved.command](
            resolved.sentence,
            records,
        );

        return dungeonCharacterActionRecord;
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
                sentence:
                    parts.length > index + 1
                        ? parts.splice(index + 1).join(' ')
                        : undefined,
            };
            return true;
        });
        return resolved;
    }

    resolveMoveAction(
        sentence: string,
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

        let targetDungeonLocationId: string;
        let action: string;
        for (var prop in directionMap) {
            if (
                records.location[prop] &&
                sentence.match(
                    new RegExp(`\s?${directionMap[prop]}(?![A-Za-z]+)`),
                )
            ) {
                targetDungeonLocationId = records.location[prop];
                action = `move ${directionMap[prop]}`;
            }
        }

        let dungeonCharacterActionRecord: DungeonCharacterActionRepositoryRecord =
            {
                dungeon_id: records.character.dungeon_id,
                dungeon_location_id: records.character.dungeon_location_id,
                dungeon_character_id: records.character.id,
                target_dungeon_location_id: targetDungeonLocationId,
                action: action,
            };

        return dungeonCharacterActionRecord;
    }

    resolveLookAction(
        sentence: string,
        records: ResolverRecords,
    ): DungeonCharacterActionRepositoryRecord {
        let dungeonCharacterActionRecord: Partial<DungeonCharacterActionRepositoryRecord> =
            {
                dungeon_id: records.character.dungeon_id,
                dungeon_location_id: records.character.dungeon_location_id,
                dungeon_character_id: records.character.id,
            };
        return null;
    }
    resolveEquipAction(
        sentence: string,
        records: ResolverRecords,
    ): DungeonCharacterActionRepositoryRecord {
        let dungeonCharacterActionRecord: Partial<DungeonCharacterActionRepositoryRecord> =
            {
                dungeon_id: records.character.dungeon_id,
                dungeon_location_id: records.character.dungeon_location_id,
                dungeon_character_id: records.character.id,
            };
        return null;
    }
    resolveStashAction(
        sentence: string,
        records: ResolverRecords,
    ): DungeonCharacterActionRepositoryRecord {
        let dungeonCharacterActionRecord: Partial<DungeonCharacterActionRepositoryRecord> =
            {
                dungeon_id: records.character.dungeon_id,
                dungeon_location_id: records.character.dungeon_location_id,
                dungeon_character_id: records.character.id,
            };
        return null;
    }
    resolveDropAction(
        sentence: string,
        records: ResolverRecords,
    ): DungeonCharacterActionRepositoryRecord {
        let dungeonCharacterActionRecord: Partial<DungeonCharacterActionRepositoryRecord> =
            {
                dungeon_id: records.character.dungeon_id,
                dungeon_location_id: records.character.dungeon_location_id,
                dungeon_character_id: records.character.id,
            };
        return null;
    }
}
