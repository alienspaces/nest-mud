import { Controller, Get, Post, Put, Body, Param, UsePipes, NotFoundException } from '@nestjs/common';

// Application
import { LoggerService } from '@/core';
import { ValidationPipe } from '@/pipes/validation/validation.pipe';
import {
    DungeonActionService,
    DungeonActionEntity,
    DungeonCharacterEntity,
    DungeonMonsterEntity,
    DungeonLocationEntity,
    DungeonObjectEntity,
} from '@/services';
import * as createDungeonCharacterActionSchema from './schema/create-dungeon-action.schema.json';
import { CreateDungeonActionDto, DungeonActionDto } from './dto';

@Controller('/api/v1/dungeons/:dungeon_id/characters/:character_id/actions')
export class DungeonCharacterActionController {
    constructor(private loggerService: LoggerService, private dungeonActionService: DungeonActionService) {}

    @UsePipes(new ValidationPipe(createDungeonCharacterActionSchema.$id, createDungeonCharacterActionSchema))
    @Post()
    async create(
        @Param('dungeon_id') dungeon_id: string,
        @Param('character_id') character_id: string,
        @Body() requestData: CreateDungeonActionDto,
    ): Promise<DungeonActionDto> {
        const logger = this.loggerService.logger({
            class: 'DungeonCharacterActionController',
            function: 'create',
        });

        logger.debug('Creating dungeon character action');

        const createDungeonActionEntity = await this.dungeonActionService.resolveDungeonCharacterAction(
            character_id,
            requestData.data.sentence,
        );

        const dungeonActionEntity = await this.dungeonActionService.createDungeonCharacterAction(
            createDungeonActionEntity,
        );

        // TODO: Fetch all dungeon actions that occurred in the same
        // locations as this character since their previous action
        const dungeonActionEntities = await this.dungeonActionService.getDungeonActions({
            characterID: character_id,
            serialID: dungeonActionEntity.serial_id,
        });

        const responseData = buildResponse(requestData.data.sentence, []);

        return responseData;
    }
}

interface BuildResponseData {
    dungeonActionEntity: DungeonActionEntity;
    dungeonCharacterEntity: DungeonCharacterEntity;
    dungeonMonsterEntity: DungeonMonsterEntity;
    dungeonLocationEntity: DungeonLocationEntity;
    dungeonCharacterEntities: DungeonCharacterEntity[];
    dungeonMonsterEntities: DungeonMonsterEntity[];
    dungeonObjectEntities: DungeonObjectEntity[];
}

function buildResponse(sentence: string, buildResponseData: BuildResponseData[]): DungeonActionDto {
    let returnData: DungeonActionDto;

    let returnDataCharacterActions: DungeonActionDto['data'] = [];

    buildResponseData.forEach((data) => {
        returnDataCharacterActions.push({
            // The action that occurred
            action: {
                id: data.dungeonActionEntity.id,
                dungeon_id: data.dungeonActionEntity.dungeon_id,
                dungeon_location_id: data.dungeonActionEntity.dungeon_location_id,
                dungeon_character_id: data.dungeonActionEntity.dungeon_character_id,
                dungeon_monster_id: data.dungeonActionEntity.dungeon_monster_id,
                command: data.dungeonActionEntity.resolved_command,
                command_result: '',
                equipped_dungeon_object_name: data.dungeonActionEntity.resolved_equipped_dungeon_object_name,
                stashed_dungeon_object_name: data.dungeonActionEntity.resolved_stashed_dungeon_object_name,
                target_dungeon_object_name: data.dungeonActionEntity.resolved_target_dungeon_object_name,
                target_dungeon_character_name: data.dungeonActionEntity.resolved_target_dungeon_character_name,
                target_dungeon_monster_name: data.dungeonActionEntity.resolved_target_dungeon_monster_name,
                target_dungeon_location_direction: data.dungeonActionEntity.resolved_target_dungeon_location_direction,
                target_dungeon_location_name: data.dungeonActionEntity.resolved_target_dungeon_location_name,
                created_at: data.dungeonActionEntity.created_at,
                updated_at: data.dungeonActionEntity.updated_at || undefined,
            },
            // The location the action occurred
            location: {
                //
            },
            // Characters at the location
            characters: [],
            // Monsters at the location
            monsters: [],
            // Objects at the location
            objects: [],
        });
    });

    returnData = { data: returnDataCharacterActions };

    return returnData;
}
