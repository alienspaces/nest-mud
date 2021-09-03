// Application
import { CreateDungeonActionEntity } from './dungeon-action.entities';
import { DUNGEON_ACTIONS, DungeonLocationRecordSet } from './dungeon-action.types';

interface ResolverSentence {
    command?: string;
    sentence?: string;
}

export class DungeonCharacterActionResolver {
    resolveAction(sentence: string, records: DungeonLocationRecordSet): CreateDungeonActionEntity {
        const resolved = this.resolveCommand(sentence);

        const resolveFuncs = {
            move: this.resolveMoveAction,
            look: this.resolveLookAction,
            equip: this.resolveEquipAction,
            stash: this.resolveStashAction,
            drop: this.resolveDropAction,
        };

        const createDungeonActionEntity = resolveFuncs[resolved.command](resolved.sentence, records);

        return createDungeonActionEntity;
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

    resolveMoveAction(sentence: string, records: DungeonLocationRecordSet): CreateDungeonActionEntity {
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

        let command: CreateDungeonActionEntity['resolved_command'];
        let targetDungeonLocationId: string;
        let targetDungeonLocationDirection: string;
        for (var prop in directionMap) {
            if (records.location[prop] && sentence.match(new RegExp(`\s?${directionMap[prop]}(?![A-Za-z]+)`))) {
                command = 'move';
                targetDungeonLocationId = records.location[prop];
                targetDungeonLocationDirection = directionMap[prop];
                break;
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

        let createDungeonActionEntity: CreateDungeonActionEntity = {
            dungeon_id: records.character.dungeon_id,
            dungeon_location_id: records.character.dungeon_location_id,
            dungeon_character_id: records.character.id,
            resolved_command: command,
            resolved_target_dungeon_location_direction: targetDungeonLocationDirection,
            resolved_target_dungeon_location_name: targetDungeonLocationName,
            resolved_target_dungeon_location_id: targetDungeonLocationId,
        };

        return createDungeonActionEntity;
    }

    resolveLookAction(sentence: string, records: DungeonLocationRecordSet): CreateDungeonActionEntity {
        let createDungeonActionEntity: Partial<CreateDungeonActionEntity> = {
            dungeon_id: records.character.dungeon_id,
            dungeon_location_id: records.character.dungeon_location_id,
            dungeon_character_id: records.character.id,
        };
        return null;
    }
    resolveEquipAction(sentence: string, records: DungeonLocationRecordSet): CreateDungeonActionEntity {
        let createDungeonActionEntity: Partial<CreateDungeonActionEntity> = {
            dungeon_id: records.character.dungeon_id,
            dungeon_location_id: records.character.dungeon_location_id,
            dungeon_character_id: records.character.id,
        };
        return null;
    }
    resolveStashAction(sentence: string, records: DungeonLocationRecordSet): CreateDungeonActionEntity {
        let createDungeonActionEntity: Partial<CreateDungeonActionEntity> = {
            dungeon_id: records.character.dungeon_id,
            dungeon_location_id: records.character.dungeon_location_id,
            dungeon_character_id: records.character.id,
        };
        return null;
    }
    resolveDropAction(sentence: string, records: DungeonLocationRecordSet): CreateDungeonActionEntity {
        let createDungeonActionEntity: Partial<CreateDungeonActionEntity> = {
            dungeon_id: records.character.dungeon_id,
            dungeon_location_id: records.character.dungeon_location_id,
            dungeon_character_id: records.character.id,
        };
        return null;
    }
}
