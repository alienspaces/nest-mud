// Application
import {
    DungeonCharacterRepositoryRecord,
    DungeonLocationRepositoryRecord,
    DungeonMonsterRepositoryRecord,
    DungeonObjectRepositoryRecord,
    DungeonCharacterActionRepositoryRecord,
} from '@/repositories';
import { Resolver } from 'dns';

interface ResolverRecords {
    character: DungeonCharacterRepositoryRecord;
    location: DungeonLocationRepositoryRecord;
    characters: DungeonCharacterRepositoryRecord[];
    monsters: DungeonMonsterRepositoryRecord[];
    objects: DungeonObjectRepositoryRecord[];
}

interface ResolverSentence {
    action: string;
    words?: string[];
}

export class DungeonCharacterActionResolver {
    // const characterActionRecord: DungeonCharacterActionRepositoryRecord = {
    //     dungeon_id: records.character.dungeon_id,
    //     dungeon_location_id: records.character.dungeon_location_id,
    //     dungeon_character_id: records.character.id,
    //     action: action,
    // };

    resolveAction(
        sentence: string,
        records: ResolverRecords,
    ): DungeonCharacterActionRepositoryRecord {
        const resolved = this.resolveSentence(sentence);

        const resolveFuncs = {
            move: this.resolveMoveAction,
            look: this.resolveLookAction,
            equip: this.resolveEquipAction,
            stash: this.resolveStashAction,
            drop: this.resolveDropAction,
        };

        const characterActionRecord = resolveFuncs[resolved.action](
            resolved.words,
            records,
        );
        return characterActionRecord;
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
        records: Resolver,
    ): DungeonCharacterActionRepositoryRecord {
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
