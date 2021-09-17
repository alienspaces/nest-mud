import { Controller, Get, Post, Put, Body, Param, UsePipes, NotFoundException, ParseUUIDPipe } from '@nestjs/common';

// Application
import { LoggerService } from '@/core';
import { ValidationPipe } from '@/pipes/validation/validation.pipe';
import {
    DungeonCharacterService,
    CreateDungeonCharacterEntity,
    UpdateDungeonCharacterEntity,
    DungeonCharacterEntity,
} from '@/services';
import * as createCharacterSchema from './schema/create-dungeon-character.schema.json';
import * as updateCharacterSchema from './schema/update-dungeon-character.schema.json';
import { CreateDungeonCharacterDto, UpdateDungeonCharacterDto, DungeonCharacterDto } from './dto';

@Controller('/api/v1/dungeons/:dungeon_id/characters')
export class DungeonCharactersController {
    constructor(private loggerService: LoggerService, private dungeonCharacterService: DungeonCharacterService) {}

    @Get()
    async getMany(
        @Param('dungeon_id', new ParseUUIDPipe({ version: '4' })) dungeon_id: string,
    ): Promise<DungeonCharacterDto> {
        const logger = this.loggerService.logger({
            class: 'DungeonCharactersController',
            function: 'get',
        });

        logger.debug(`Getting dungeon ID ${dungeon_id} characters`);

        const characterEntities = await this.dungeonCharacterService.getDungeonCharacters({
            dungeon_id: dungeon_id,
        });

        logger.debug(`Have ${characterEntities ? characterEntities.length : 0} characters`);

        const responseData = buildResponse(characterEntities);
        return responseData;
    }

    @Get('/:character_id')
    async get(
        @Param('dungeon_id', new ParseUUIDPipe({ version: '4' })) dungeon_id: string,
        @Param('character_id', new ParseUUIDPipe({ version: '4' })) character_id: string,
    ): Promise<DungeonCharacterDto> {
        const logger = this.loggerService.logger({
            class: 'DungeonCharactersController',
            function: 'get',
        });

        logger.debug(`Getting dungeon ID ${dungeon_id} character ID ${character_id}`);

        const characterEntity = await this.dungeonCharacterService.getDungeonCharacter(character_id);
        if (!characterEntity) {
            logger.error('Failed getting dungeon character entity');
            throw new NotFoundException();
        }
        if (characterEntity.dungeon_id !== dungeon_id) {
            logger.error('Dungeon character entity requested does not belong to requested dungeon');
            throw new NotFoundException();
        }
        const responseData = buildResponse([characterEntity]);
        return responseData;
    }

    @UsePipes(new ValidationPipe(createCharacterSchema.$id, createCharacterSchema))
    @Post()
    async create(
        @Param('dungeon_id', new ParseUUIDPipe({ version: '4' })) dungeon_id: string,
        @Body() requestData: CreateDungeonCharacterDto,
    ): Promise<DungeonCharacterDto> {
        const logger = this.loggerService.logger({
            class: 'DungeonCharactersController',
            function: 'create',
        });

        logger.debug('Creating character');

        const CreateDungeonCharacterEntity: CreateDungeonCharacterEntity = {
            dungeon_id: dungeon_id,
            name: requestData.data.name,
            strength: requestData.data.strength,
            dexterity: requestData.data.dexterity,
            intelligence: requestData.data.intelligence,
        };

        const dungeonCharacterEntity = await this.dungeonCharacterService.createDungeonCharacter(
            CreateDungeonCharacterEntity,
        );

        const responseData: DungeonCharacterDto = {
            data: [
                {
                    id: dungeonCharacterEntity.id,
                    dungeon_id: dungeonCharacterEntity.dungeon_id,
                    dungeon_location_id: dungeonCharacterEntity.dungeon_location_id,
                    name: dungeonCharacterEntity.name,
                    strength: dungeonCharacterEntity.strength,
                    dexterity: dungeonCharacterEntity.dexterity,
                    intelligence: dungeonCharacterEntity.intelligence,
                    health: dungeonCharacterEntity.health,
                    fatigue: dungeonCharacterEntity.fatigue,
                    coins: dungeonCharacterEntity.coins,
                    experience_points: dungeonCharacterEntity.experience_points,
                    attribute_points: dungeonCharacterEntity.attribute_points,
                    created_at: dungeonCharacterEntity.created_at,
                    updated_at: dungeonCharacterEntity.updated_at,
                },
            ],
        };

        return responseData;
    }

    @UsePipes(new ValidationPipe(updateCharacterSchema.$id, updateCharacterSchema))
    @Put(':id')
    async update(
        @Param('dungeon_id', new ParseUUIDPipe({ version: '4' })) dungeon_id: string,
        @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
        @Body() requestData: UpdateDungeonCharacterDto,
    ): Promise<DungeonCharacterDto> {
        const logger = this.loggerService.logger({
            class: 'DungeonCharactersController',
            function: 'update',
        });
        logger.debug('Updating character');

        let dungeonCharacterEntity: DungeonCharacterEntity = await this.dungeonCharacterService.getDungeonCharacter(id);

        if (!dungeonCharacterEntity) {
            throw new NotFoundException();
        }

        if (dungeonCharacterEntity.dungeon_id !== dungeon_id) {
            throw new NotFoundException();
        }

        const UpdateDungeonCharacterEntity: UpdateDungeonCharacterEntity = {
            id: id,
            dungeon_id: dungeonCharacterEntity.dungeon_id,
            dungeon_location_id: dungeonCharacterEntity.dungeon_location_id,
            name: requestData.data.name,
            strength: requestData.data.strength,
            dexterity: requestData.data.dexterity,
            intelligence: requestData.data.intelligence,
            health: dungeonCharacterEntity.health,
            fatigue: dungeonCharacterEntity.fatigue,
            coins: dungeonCharacterEntity.coins,
            experience_points: dungeonCharacterEntity.experience_points,
            attribute_points: dungeonCharacterEntity.attribute_points,
        };

        dungeonCharacterEntity = await this.dungeonCharacterService.updateDungeonCharacter(
            UpdateDungeonCharacterEntity,
        );

        const responseData = buildResponse([dungeonCharacterEntity]);

        return responseData;
    }
}

function buildResponse(dungeonCharacterEntities: DungeonCharacterEntity[]): DungeonCharacterDto {
    let returnData: DungeonCharacterDto;
    if (!dungeonCharacterEntities) {
        return returnData;
    }

    let returnDataCharacters: DungeonCharacterDto['data'] = [];

    dungeonCharacterEntities.forEach((data) => {
        returnDataCharacters.push({
            id: data.id,
            dungeon_id: data.dungeon_id,
            dungeon_location_id: data.dungeon_location_id,
            name: data.name,
            strength: data.strength,
            dexterity: data.dexterity,
            intelligence: data.intelligence,
            health: data.health,
            fatigue: data.fatigue,
            coins: data.coins,
            experience_points: data.experience_points,
            attribute_points: data.attribute_points,
            created_at: data.created_at,
            updated_at: data.updated_at || undefined,
        });
    });

    returnData = { data: returnDataCharacters };

    return returnData;
}
