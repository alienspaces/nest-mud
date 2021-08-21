import { Injectable } from '@nestjs/common';

// Application
import {
    DungeonCharacterRepository,
    DungeonCharacterRepositoryRecord,
    DungeonCharacterRepositoryParameter,
    DungeonLocationRepository,
    DungeonLocationRepositoryRecord,
} from '@/repositories';

import {
    CreateDungeonCharacterEntity,
    UpdateDungeonCharacterEntity,
    DungeonCharacterEntity,
} from './dungeon-character.entities';

export interface DungeonCharacterParameters {
    dungeon_id?: string;
}
const defaultCoins = 100;
const defaultExperiencePoints = 0;
const defaultAttributePoints = 30;

@Injectable()
export class DungeonCharacterService {
    constructor(
        private dungeonCharacterRepository: DungeonCharacterRepository,
        private dungeonLocationRepository: DungeonLocationRepository,
    ) {}

    async getDungeonCharacter(id: string): Promise<DungeonCharacterEntity> {
        const characterRecord = await this.dungeonCharacterRepository.getOne({
            id: id,
        });
        const dungeonCharacterEntity =
            this.buildDungeonCharacterEntity(characterRecord);
        return dungeonCharacterEntity;
    }

    async getDungeonCharacters(
        parameters?: DungeonCharacterParameters,
    ): Promise<DungeonCharacterEntity[]> {
        // TODO: Can probably write a generic function for this however directly
        // mapping service parameters to repository parameters is probably not
        // going to be a consistent pattern..
        const repositoryParameters: DungeonCharacterRepositoryParameter[] = [];
        for (var key in parameters) {
            if (parameters.hasOwnProperty(key)) {
                repositoryParameters.push({
                    column: key,
                    value: parameters[key],
                } as DungeonCharacterRepositoryParameter);
            }
        }

        const dungeonCharacterRecords =
            await this.dungeonCharacterRepository.getMany({
                parameters: repositoryParameters,
            });

        const dungeonCharacterEntities: DungeonCharacterEntity[] = [];
        dungeonCharacterRecords.forEach((dungeonCharacterRecord) => {
            dungeonCharacterEntities.push(
                this.buildDungeonCharacterEntity(dungeonCharacterRecord),
            );
        });

        return dungeonCharacterEntities;
    }

    async createDungeonCharacter(
        CreateDungeonCharacterEntity: CreateDungeonCharacterEntity,
    ): Promise<DungeonCharacterEntity> {
        const dungeonLocationRecords =
            await this.dungeonLocationRepository.getMany({
                parameters: [
                    {
                        column: 'dungeon_id',
                        value: CreateDungeonCharacterEntity.dungeon_id,
                    },
                    { column: 'default', value: true },
                ],
            });
        if (dungeonLocationRecords.length !== 1) {
            throw new Error(
                `Dungeon ${CreateDungeonCharacterEntity.dungeon_id} default location record not found`,
            );
        }

        // TODO: Move to validation function and calculate max attributes based
        // on character experience
        if (
            CreateDungeonCharacterEntity.strength +
                CreateDungeonCharacterEntity.dexterity +
                CreateDungeonCharacterEntity.intelligence >
            defaultAttributePoints
        ) {
            throw new Error(
                `New character attributes exceeds allowed maximum of ${defaultAttributePoints}`,
            );
        }

        const characterRecord: DungeonCharacterRepositoryRecord = {
            id: CreateDungeonCharacterEntity.id || null,
            dungeon_id: CreateDungeonCharacterEntity.dungeon_id,
            dungeon_location_id: dungeonLocationRecords[0].id,
            name: CreateDungeonCharacterEntity.name,
            strength: CreateDungeonCharacterEntity.strength,
            dexterity: CreateDungeonCharacterEntity.dexterity,
            intelligence: CreateDungeonCharacterEntity.intelligence,
            health: this.calculateHealth({
                strength: CreateDungeonCharacterEntity.strength,
                dexterity: CreateDungeonCharacterEntity.dexterity,
            }),
            fatigue: this.calculateFatigue({
                strength: CreateDungeonCharacterEntity.strength,
                intelligence: CreateDungeonCharacterEntity.intelligence,
            }),
            coins: defaultCoins,
            experience_points: defaultExperiencePoints,
            attribute_points: 0,
        };

        await this.dungeonCharacterRepository.insertOne({
            record: characterRecord,
        });

        const dungeonCharacterEntity =
            this.buildDungeonCharacterEntity(characterRecord);
        return dungeonCharacterEntity;
    }

    async updateDungeonCharacter(
        updateDungeonCharacterEntity: UpdateDungeonCharacterEntity,
    ): Promise<DungeonCharacterEntity> {
        const allowedAttributePoints = this.calculateAttributePoints({
            experiencePoints: updateDungeonCharacterEntity.experience_points,
        });

        if (
            updateDungeonCharacterEntity.strength +
                updateDungeonCharacterEntity.dexterity +
                updateDungeonCharacterEntity.intelligence >
            allowedAttributePoints
        ) {
            throw new Error(
                `New character attributes exceeds allowed maximum of ${allowedAttributePoints}`,
            );
        }

        const characterRecord = await this.dungeonCharacterRepository.getOne({
            id: updateDungeonCharacterEntity.id,
        });

        characterRecord.name = updateDungeonCharacterEntity.name;
        characterRecord.dungeon_location_id =
            updateDungeonCharacterEntity.dungeon_location_id;
        characterRecord.strength = updateDungeonCharacterEntity.strength;
        characterRecord.dexterity = updateDungeonCharacterEntity.dexterity;
        characterRecord.intelligence =
            updateDungeonCharacterEntity.intelligence;
        characterRecord.health = updateDungeonCharacterEntity.health;
        characterRecord.fatigue = updateDungeonCharacterEntity.fatigue;
        characterRecord.coins = updateDungeonCharacterEntity.coins;
        characterRecord.experience_points =
            updateDungeonCharacterEntity.experience_points;
        characterRecord.attribute_points =
            updateDungeonCharacterEntity.attribute_points;

        await this.dungeonCharacterRepository.updateOne({
            record: characterRecord,
        });

        const dungeonCharacterEntity =
            this.buildDungeonCharacterEntity(characterRecord);
        return dungeonCharacterEntity;
    }

    async deleteDungeonCharacter(id: string): Promise<void> {
        await this.dungeonCharacterRepository.deleteOne({ id: id });
        return;
    }

    calculateHealth(args: { strength: number; dexterity: number }): number {
        return args.strength + args.dexterity * 10;
    }

    calculateFatigue(args: { strength: number; intelligence: number }): number {
        return args.strength + args.intelligence * 10;
    }

    calculateAttributePoints(args: { experiencePoints: number }): number {
        return defaultAttributePoints + (args.experiencePoints ^ (2 / 100));
    }

    buildDungeonCharacterEntity(
        characterRecord: DungeonCharacterRepositoryRecord,
    ): DungeonCharacterEntity {
        const dungeonCharacterEntity: DungeonCharacterEntity = {
            id: characterRecord.id,
            dungeon_id: characterRecord.dungeon_id,
            dungeon_location_id: characterRecord.dungeon_location_id,
            name: characterRecord.name,
            strength: characterRecord.strength,
            dexterity: characterRecord.dexterity,
            intelligence: characterRecord.intelligence,
            health: characterRecord.health,
            fatigue: characterRecord.fatigue,
            coins: characterRecord.coins,
            experience_points: characterRecord.experience_points,
            attribute_points: characterRecord.attribute_points,
            created_at: characterRecord.created_at,
            updated_at: characterRecord.updated_at,
            deleted_at: characterRecord.deleted_at,
        };
        return dungeonCharacterEntity;
    }
}
