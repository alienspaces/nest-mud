import { Injectable } from '@nestjs/common';

// Application
import {
    DungeonCharacterActionRepository,
    DungeonCharacterActionRepositoryRecord,
} from '@/repositories';

import {
    CreateDungeonCharacterActionEntity,
    UpdateDungeonCharacterActionEntity,
    DungeonCharacterActionEntity,
} from './dungeon-character-action.entities';

@Injectable()
export class DungeonCharacterActionService {
    constructor(
        private dungeonCharacterActionRepository: DungeonCharacterActionRepository,
    ) {}

    async getDungeonCharacterAction(
        id: string,
    ): Promise<DungeonCharacterActionEntity> {
        const dungeonCharacterActionRecord =
            await this.dungeonCharacterActionRepository.getOne({
                id: id,
            });
        const dungeonCharacterActionEntity =
            this.buildDungeonCharacterActionEntity(
                dungeonCharacterActionRecord,
            );
        return dungeonCharacterActionEntity;
    }

    async createDungeonCharacterAction(
        createDungeonCharacterActionEntity: CreateDungeonCharacterActionEntity,
    ): Promise<DungeonCharacterActionEntity> {
        throw new Error('Method not implemented');
    }

    async updateDungeonCharacterAction(
        updateDungeonCharacterActionEntity: UpdateDungeonCharacterActionEntity,
    ): Promise<DungeonCharacterActionEntity> {
        throw new Error('Method not implemented');
    }

    async deleteDungeonCharacterAction(id: string): Promise<void> {
        throw new Error('Method not implemented');
    }

    buildDungeonCharacterActionEntity(
        dungeonCharacterActionRecord: DungeonCharacterActionRepositoryRecord,
    ): DungeonCharacterActionEntity {
        throw new Error('Method not implemented');
    }
}
