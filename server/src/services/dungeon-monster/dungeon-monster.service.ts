import { Injectable } from '@nestjs/common';

// Application
import {
    DungeonMonsterRepository,
    DungeonMonsterRepositoryRecord,
    DungeonMonsterRepositoryParameter,
    DungeonLocationRepository,
    DungeonLocationRepositoryRecord,
} from '@/repositories';

import {
    CreateDungeonMonsterEntity,
    UpdateDungeonMonsterEntity,
    DungeonMonsterEntity,
} from './dungeon-monster.entities';

export interface DungeonMonsterParameters {
    dungeon_id?: string;
    dungeon_location_id?: string;
}

const defaultCoins = 10;

@Injectable()
export class DungeonMonsterService {
    constructor(
        private dungeonMonsterRepository: DungeonMonsterRepository,
        private dungeonLocationRepository: DungeonLocationRepository,
    ) {}

    async getDungeonMonster(id: string): Promise<DungeonMonsterEntity> {
        const dungeonMonsterRecord = await this.dungeonMonsterRepository.getOne({
            id: id,
        });
        const dungeonMonsterEntity = this.buildDungeonMonsterEntity(dungeonMonsterRecord);
        return dungeonMonsterEntity;
    }

    async getDungeonMonsters(parameters?: DungeonMonsterParameters): Promise<DungeonMonsterEntity[]> {
        // TODO: Can probably write a generic function for this however directly
        // mapping service parameters to repository parameters is probably not
        // going to be a consistent pattern..
        const repositoryParameters: DungeonMonsterRepositoryParameter[] = [];
        for (var key in parameters) {
            if (parameters.hasOwnProperty(key)) {
                repositoryParameters.push({
                    column: key,
                    value: parameters[key],
                } as DungeonMonsterRepositoryParameter);
            }
        }

        const dungeonMonsterRecords = await this.dungeonMonsterRepository.getMany({
            parameters: repositoryParameters,
        });

        const dungeonMonsterEntities: DungeonMonsterEntity[] = [];
        dungeonMonsterRecords.forEach((dungeonMonsterRecord) => {
            dungeonMonsterEntities.push(this.buildDungeonMonsterEntity(dungeonMonsterRecord));
        });

        return dungeonMonsterEntities;
    }

    async createDungeonMonster(createDungeonMonsterEntity: CreateDungeonMonsterEntity): Promise<DungeonMonsterEntity> {
        const dungeonMonsterRecord: DungeonMonsterRepositoryRecord = {
            id: createDungeonMonsterEntity.id || null,
            dungeon_id: createDungeonMonsterEntity.dungeon_id,
            dungeon_location_id: createDungeonMonsterEntity.dungeon_location_id,
            name: createDungeonMonsterEntity.name,
            strength: createDungeonMonsterEntity.strength,
            dexterity: createDungeonMonsterEntity.dexterity,
            intelligence: createDungeonMonsterEntity.intelligence,
            health: this.calculateHealth({
                strength: createDungeonMonsterEntity.strength,
                dexterity: createDungeonMonsterEntity.dexterity,
            }),
            fatigue: this.calculateFatigue({
                strength: createDungeonMonsterEntity.strength,
                intelligence: createDungeonMonsterEntity.intelligence,
            }),
            coins: defaultCoins,
        };

        await this.dungeonMonsterRepository.insertOne({
            record: dungeonMonsterRecord,
        });

        const dungeonMonsterEntity = this.buildDungeonMonsterEntity(dungeonMonsterRecord);
        return dungeonMonsterEntity;
    }

    async updateDungeonMonster(updateDungeonMonsterEntity: UpdateDungeonMonsterEntity): Promise<DungeonMonsterEntity> {
        const dungeonMonsterRecord = await this.dungeonMonsterRepository.getOne({
            id: updateDungeonMonsterEntity.id,
        });

        dungeonMonsterRecord.name = updateDungeonMonsterEntity.name;
        dungeonMonsterRecord.dungeon_location_id = updateDungeonMonsterEntity.dungeon_location_id;
        dungeonMonsterRecord.strength = updateDungeonMonsterEntity.strength;
        dungeonMonsterRecord.dexterity = updateDungeonMonsterEntity.dexterity;
        dungeonMonsterRecord.intelligence = updateDungeonMonsterEntity.intelligence;
        dungeonMonsterRecord.health = updateDungeonMonsterEntity.health;
        dungeonMonsterRecord.fatigue = updateDungeonMonsterEntity.fatigue;
        dungeonMonsterRecord.coins = updateDungeonMonsterEntity.coins;

        await this.dungeonMonsterRepository.updateOne({
            record: dungeonMonsterRecord,
        });

        const dungeonMonsterEntity = this.buildDungeonMonsterEntity(dungeonMonsterRecord);
        return dungeonMonsterEntity;
    }

    async deleteDungeonMonster(id: string): Promise<void> {
        await this.dungeonMonsterRepository.deleteOne({ id: id });
        return;
    }

    calculateHealth(args: { strength: number; dexterity: number }): number {
        return args.strength + args.dexterity * 10;
    }

    calculateFatigue(args: { strength: number; intelligence: number }): number {
        return args.strength + args.intelligence * 10;
    }

    buildDungeonMonsterEntity(dungeonMonsterRecord: DungeonMonsterRepositoryRecord): DungeonMonsterEntity {
        const dungeonMonsterEntity: DungeonMonsterEntity = {
            id: dungeonMonsterRecord.id,
            dungeon_id: dungeonMonsterRecord.dungeon_id,
            dungeon_location_id: dungeonMonsterRecord.dungeon_location_id,
            name: dungeonMonsterRecord.name,
            strength: dungeonMonsterRecord.strength,
            dexterity: dungeonMonsterRecord.dexterity,
            intelligence: dungeonMonsterRecord.intelligence,
            health: dungeonMonsterRecord.health,
            fatigue: dungeonMonsterRecord.fatigue,
            coins: dungeonMonsterRecord.coins,
            created_at: dungeonMonsterRecord.created_at,
            updated_at: dungeonMonsterRecord.updated_at,
        };
        return dungeonMonsterEntity;
    }
}
