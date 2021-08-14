import { Controller, Post, Put, Body, Param, UsePipes } from '@nestjs/common';

// Application
import { LoggerService } from '@/core';
import { ValidationPipe } from '@/pipes/validation/validation.pipe';
import {
    CharacterService,
    CreateCharacterEntity,
    UpdateCharacterEntity,
    CharacterEntity,
} from '@/services';
import * as createCharacterSchema from './schema/create-character.schema.json';
import * as updateCharacterSchema from './schema/update-character.schema.json';
import { CreateCharacterDto, UpdateCharacterDto, CharacterDto } from './dto';

@Controller('/api/v1/characters')
export class CharactersController {
    constructor(
        private loggerService: LoggerService,
        private characterService: CharacterService,
    ) {}

    @UsePipes(
        new ValidationPipe(createCharacterSchema.$id, createCharacterSchema),
    )
    @Post()
    async create(
        @Body() requestData: CreateCharacterDto,
    ): Promise<CharacterDto> {
        const logger = this.loggerService.logger({
            class: 'CharactersController',
            function: 'create',
        });

        logger.info('Creating character');

        const createCharacterEntity: CreateCharacterEntity = {
            name: requestData.data.name,
            strength: requestData.data.strength,
            dexterity: requestData.data.dexterity,
            intelligence: requestData.data.intelligence,
        };

        const characterEntity = await this.characterService.createCharacter(
            createCharacterEntity,
        );

        const responseData: CharacterDto = {
            data: [
                {
                    id: characterEntity.id,
                    location_id: characterEntity.location_id,
                    name: characterEntity.name,
                    strength: characterEntity.strength,
                    dexterity: characterEntity.dexterity,
                    intelligence: characterEntity.intelligence,
                    coin: characterEntity.coin,
                    experience: characterEntity.experience,
                    created_at: characterEntity.created_at,
                    updated_at: characterEntity.updated_at,
                },
            ],
        };

        return responseData;
    }

    @UsePipes(
        new ValidationPipe(updateCharacterSchema.$id, updateCharacterSchema),
    )
    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() requestData: UpdateCharacterDto,
    ): Promise<CharacterDto> {
        const logger = this.loggerService.logger({
            class: 'CharactersController',
            function: 'update',
        });
        logger.info('Updating character');

        let characterEntity: CharacterEntity =
            await this.characterService.getCharacter(id);

        const updateCharacterEntity: UpdateCharacterEntity = {
            id: id,
            location_id: characterEntity.location_id,
            name: requestData.data.name,
            strength: requestData.data.strength,
            dexterity: requestData.data.dexterity,
            intelligence: requestData.data.intelligence,
            coin: characterEntity.coin,
            experience: characterEntity.experience,
        };

        characterEntity = await this.characterService.updateCharacter(
            updateCharacterEntity,
        );

        const responseData = buildResponse([characterEntity]);

        return responseData;
    }
}

function buildResponse(characterEntities: CharacterEntity[]): CharacterDto {
    let returnData: CharacterDto;
    if (!characterEntities) {
        return returnData;
    }

    let returnDataCharacters: CharacterDto['data'] = [];

    characterEntities.forEach((data) => {
        returnDataCharacters.push({
            id: data.id,
            location_id: data.location_id,
            name: data.name,
            strength: data.strength,
            dexterity: data.dexterity,
            intelligence: data.intelligence,
            coin: data.coin,
            experience: data.experience,
            created_at: data.created_at,
            updated_at: data.updated_at,
        });
    });

    returnData = { data: returnDataCharacters };

    return returnData;
}
