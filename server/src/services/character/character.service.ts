import { Injectable } from '@nestjs/common';

// Application
import {
    CharacterRepository,
    CharacterRepositoryRecord,
    LocationRepository,
    LocationRepositoryRecord,
} from '@/repositories';

import { CreateCharacterEntity, CharacterEntity } from './character.entities';

const defaultCoin = 100;
const maxAttributes = 30;

@Injectable()
export class CharacterService {
    constructor(
        private characterRepository: CharacterRepository,
        private locationRepository: LocationRepository,
    ) {}

    async getCharacter(id: string): Promise<CharacterEntity> {
        return null;
    }

    async createCharacter(
        createCharacterEntity: CreateCharacterEntity,
    ): Promise<CharacterEntity> {
        const locationRecords = await this.locationRepository.getMany({
            parameters: [{ column: 'default', value: true }],
        });
        if (locationRecords.length !== 1) {
            throw new Error('Default location record not found');
        }

        if (
            createCharacterEntity.strength +
                createCharacterEntity.dexterity +
                createCharacterEntity.intelligence >
            maxAttributes
        ) {
            throw new Error(
                `New character attributes exceeds allowed maximum of ${maxAttributes}`,
            );
        }

        const characterRecord: CharacterRepositoryRecord = {
            location_id: locationRecords[0].id,
            name: createCharacterEntity.name,
            strength: createCharacterEntity.strength,
            dexterity: createCharacterEntity.dexterity,
            intelligence: createCharacterEntity.intelligence,
            coin: defaultCoin,
        };

        await this.characterRepository.insertOne({
            record: characterRecord,
        });

        const characterEntity: CharacterEntity = {
            id: characterRecord.id,
            location_id: characterRecord.location_id,
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

    async updateCharacter(characterEntity: CharacterEntity): Promise<void> {
        return null;
    }

    async deleteCharacter(id: string): Promise<void> {
        return null;
    }
}
