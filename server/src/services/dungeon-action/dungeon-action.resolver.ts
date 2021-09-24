// Application
import { DungeonActionRepositoryRecord } from '@/repositories';
import { DUNGEON_ACTIONS, DungeonLocationRecordSet } from './dungeon-action.types';

interface ResolverSentence {
    command?: string;
    sentence?: string;
}

// Property names mapped to direction words
const DIRECTION_MAP = {
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

export class DungeonCharacterActionResolver {
    resolveAction(sentence: string, records: DungeonLocationRecordSet): DungeonActionRepositoryRecord {
        const resolved = this.resolveCommand(sentence);

        const resolveFuncs = {
            move: this.resolveMoveAction,
            look: this.resolveLookAction,
            equip: this.resolveEquipAction,
            stash: this.resolveStashAction,
            drop: this.resolveDropAction,
        };

        const dungeonActionRecord = resolveFuncs[resolved.command](resolved.sentence, records);

        return dungeonActionRecord;
    }

    resolveCommand(sentence: string): ResolverSentence {
        const parts = sentence.split(' ');
        let resolved: ResolverSentence = {};

        [...DUNGEON_ACTIONS].some((findAction) => {
            const index = parts.indexOf(findAction);
            if (index === -1) {
                return;
            }
            resolved = {
                command: findAction,
                sentence: parts.length > index + 1 ? parts.splice(index + 1).join(' ') : undefined,
            };
            return true;
        });

        return resolved;
    }

    resolveMoveAction(sentence: string, records: DungeonLocationRecordSet): DungeonActionRepositoryRecord {
        let command: DungeonActionRepositoryRecord['resolved_command'];
        let targetDungeonLocationId: string;
        let targetDungeonLocationDirection: string;

        if (sentence) {
            for (var prop in DIRECTION_MAP) {
                if (records.location[prop] && sentence.match(new RegExp(`\s?${DIRECTION_MAP[prop]}(?![A-Za-z]+)`))) {
                    command = 'move';
                    targetDungeonLocationId = records.location[prop];
                    targetDungeonLocationDirection = DIRECTION_MAP[prop];
                    break;
                }
            }
        }

        let targetDungeonLocationName: string;
        if (targetDungeonLocationId && records.locations) {
            records.locations.some((location) => {
                if (location.id === targetDungeonLocationId) {
                    targetDungeonLocationName = location.name;
                    return true;
                }
            });
        }

        const dungeonActionRecord: DungeonActionRepositoryRecord = {
            dungeon_id: records.character.dungeon_id,
            dungeon_location_id: records.character.dungeon_location_id,
            dungeon_character_id: records.character.id,
            resolved_command: command,
            resolved_target_dungeon_location_direction: targetDungeonLocationDirection,
            resolved_target_dungeon_location_name: targetDungeonLocationName,
            resolved_target_dungeon_location_id: targetDungeonLocationId,
        };

        return dungeonActionRecord;
    }

    resolveLookAction(sentence: string, records: DungeonLocationRecordSet): DungeonActionRepositoryRecord {
        const command = 'look';
        let targetDungeonLocationId: string;
        let targetDungeonLocationDirection: string;

        // Looking in a direction where there is another location?
        if (sentence) {
            for (var prop in DIRECTION_MAP) {
                if (records.location[prop] && sentence.match(new RegExp(`\s?${DIRECTION_MAP[prop]}(?![A-Za-z]+)`))) {
                    targetDungeonLocationId = records.location[prop];
                    targetDungeonLocationDirection = DIRECTION_MAP[prop];
                    break;
                }
            }
        }

        // When not a direction where there is a room exit the character
        // is looking at the current location.
        let targetDungeonLocationName: string;
        if (targetDungeonLocationId == null) {
            targetDungeonLocationId = records.location.id;
            targetDungeonLocationName = records.location.name;
        } else if (records.locations) {
            records.locations.some((location) => {
                if (location.id === targetDungeonLocationId) {
                    targetDungeonLocationName = location.name;
                    return true;
                }
            });
        }

        const dungeonActionRecord: DungeonActionRepositoryRecord = {
            dungeon_id: records.character.dungeon_id,
            dungeon_location_id: records.character.dungeon_location_id,
            dungeon_character_id: records.character.id,
            resolved_command: command,
            resolved_target_dungeon_location_direction: targetDungeonLocationDirection,
            resolved_target_dungeon_location_name: targetDungeonLocationName,
            resolved_target_dungeon_location_id: targetDungeonLocationId,
        };

        console.warn('Dungeon action record', dungeonActionRecord);

        return dungeonActionRecord;
    }

    resolveEquipAction(sentence: string, records: DungeonLocationRecordSet): DungeonActionRepositoryRecord {
        let dungeonActionRecord: Partial<DungeonActionRepositoryRecord> = {
            dungeon_id: records.character.dungeon_id,
            dungeon_location_id: records.character.dungeon_location_id,
            dungeon_character_id: records.character.id,
        };
        return null;
    }
    resolveStashAction(sentence: string, records: DungeonLocationRecordSet): DungeonActionRepositoryRecord {
        let dungeonActionRecord: Partial<DungeonActionRepositoryRecord> = {
            dungeon_id: records.character.dungeon_id,
            dungeon_location_id: records.character.dungeon_location_id,
            dungeon_character_id: records.character.id,
        };
        return null;
    }
    resolveDropAction(sentence: string, records: DungeonLocationRecordSet): DungeonActionRepositoryRecord {
        let dungeonActionRecord: Partial<DungeonActionRepositoryRecord> = {
            dungeon_id: records.character.dungeon_id,
            dungeon_location_id: records.character.dungeon_location_id,
            dungeon_character_id: records.character.id,
        };
        return null;
    }
}
