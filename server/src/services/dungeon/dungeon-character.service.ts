import { Injectable } from '@nestjs/common';

// Application
import {
    DungeonCharacterRepository,
    DungeonCharacterRepositoryRecord,
    DungeonLocationRepository,
    DungeonLocationRepositoryRecord,
} from '@/repositories';

import {
    CreateDungeonCharacterEntity,
    UpdateDungeonCharacterEntity,
    DungeonCharacterEntity,
} from './dungeon-character.entities';
import { UpdateDungeonCharacterDto } from '@/controllers/dungeon-character/dto';

const defaultCoin = 100;
const defaultExperience = 0;
const maxAttributes = 30;

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
        const characterEntity =
            this.buildDungeonCharacterEntity(characterRecord);
        return characterEntity;
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
            maxAttributes
        ) {
            throw new Error(
                `New character attributes exceeds allowed maximum of ${maxAttributes}`,
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
            coin: defaultCoin,
            experience: defaultExperience,
        };

        await this.dungeonCharacterRepository.insertOne({
            record: characterRecord,
        });

        const characterEntity =
            this.buildDungeonCharacterEntity(characterRecord);
        return characterEntity;
    }

    async updateDungeonCharacter(
        UpdateDungeonCharacterEntity: UpdateDungeonCharacterEntity,
    ): Promise<DungeonCharacterEntity> {
        // TODO: Move to validation function and calculate max attributes based
        // on character experience
        if (
            UpdateDungeonCharacterEntity.strength +
                UpdateDungeonCharacterEntity.dexterity +
                UpdateDungeonCharacterEntity.intelligence >
            maxAttributes
        ) {
            throw new Error(
                `New character attributes exceeds allowed maximum of ${maxAttributes}`,
            );
        }

        const characterRecord = await this.dungeonCharacterRepository.getOne({
            id: UpdateDungeonCharacterEntity.id,
        });

        characterRecord.name = UpdateDungeonCharacterEntity.name;
        characterRecord.dungeon_location_id =
            UpdateDungeonCharacterEntity.dungeon_location_id;
        characterRecord.strength = UpdateDungeonCharacterEntity.strength;
        characterRecord.dexterity = UpdateDungeonCharacterEntity.dexterity;
        characterRecord.intelligence =
            UpdateDungeonCharacterEntity.intelligence;
        characterRecord.coin = UpdateDungeonCharacterEntity.coin;
        characterRecord.experience = UpdateDungeonCharacterEntity.experience;

        await this.dungeonCharacterRepository.updateOne({
            record: characterRecord,
        });

        const characterEntity =
            this.buildDungeonCharacterEntity(characterRecord);
        return characterEntity;
    }

    async deleteDungeonCharacter(id: string): Promise<void> {
        await this.dungeonCharacterRepository.deleteOne({ id: id });
        return;
    }

    buildDungeonCharacterEntity(
        characterRecord: DungeonCharacterRepositoryRecord,
    ): DungeonCharacterEntity {
        const characterEntity: DungeonCharacterEntity = {
            id: characterRecord.id,
            dungeon_id: characterRecord.dungeon_id,
            dungeon_location_id: characterRecord.dungeon_location_id,
            name: characterRecord.name,
            strength: characterRecord.strength,
            dexterity: characterRecord.dexterity,
            intelligence: characterRecord.intelligence,
            coin: characterRecord.coin,
            experience: characterRecord.experience,
            created_at: characterRecord.created_at,
            updated_at: characterRecord.updated_at,
            deleted_at: characterRecord.deleted_at,
        };
        return characterEntity;
    }
}
