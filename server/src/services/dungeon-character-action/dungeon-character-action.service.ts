import { Injectable } from '@nestjs/common';

// Application
import {
    DungeonCharacterActionRepository,
    DungeonCharacterActionRepositoryRecord,
} from '@/repositories';

import {
    CreateDungeonCharacterActionEntity,
    DungeonCharacterActionEntity,
} from './dungeon-character-action.entities';

@Injectable()
export class DungeonCharacterActionService {
    constructor(
        private dungeonCharacterActionRepository: DungeonCharacterActionRepository,
    ) {}

    async createDungeonCharacterAction(
        createDungeonCharacterActionEntity: CreateDungeonCharacterActionEntity,
    ): Promise<DungeonCharacterActionEntity> {
        throw new Error('Method not implemented');
    }
}
