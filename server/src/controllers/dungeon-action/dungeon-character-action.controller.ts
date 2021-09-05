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
    DungeonActionEntitySet,
} from '@/services';
import * as createDungeonCharacterActionSchema from './schema/create-dungeon-action.schema.json';
import { CreateDungeonActionDto, DungeonActionDataDto, DungeonActionDto } from './dto';

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

        const dungeonActionEntity = await this.dungeonActionService.processDungeonCharacterAction(
            character_id,
            requestData.data.sentence,
        );

        // Fetch all dungeon action events that have occurred since their last action
        const dungeonActionEntitySets = await this.dungeonActionService.getCharacterDungeonActionEntitySets(
            dungeonActionEntity,
        );

        const responseData = buildResponse(requestData.data.sentence, dungeonActionEntitySets);

        return responseData;
    }
}

function buildResponse(sentence: string, dungeonActionEntitySets: DungeonActionEntitySet[]): DungeonActionDto {
    let returnData: DungeonActionDto;

    let dungeonActionData: DungeonActionDto['data'] = [];

    dungeonActionEntitySets.forEach((dungeonActionEntitySet) => {
        const dungeonActionEntity = dungeonActionEntitySet.dungeonActionEntity;
        const dungeonLocationEntity = dungeonActionEntitySet.dungeonLocationEntity;

        const dungeonActionDataItem: DungeonActionDataDto = {
            // The action that occurred
            action: {
                id: dungeonActionEntity.id,
                command: dungeonActionEntity.resolved_command,
                command_result: '',
                equipped_dungeon_object_name: dungeonActionEntity.resolved_equipped_dungeon_object_name,
                stashed_dungeon_object_name: dungeonActionEntity.resolved_stashed_dungeon_object_name,
                target_dungeon_object_name: dungeonActionEntity.resolved_target_dungeon_object_name,
                target_dungeon_character_name: dungeonActionEntity.resolved_target_dungeon_character_name,
                target_dungeon_monster_name: dungeonActionEntity.resolved_target_dungeon_monster_name,
                target_dungeon_location_direction: dungeonActionEntity.resolved_target_dungeon_location_direction,
                target_dungeon_location_name: dungeonActionEntity.resolved_target_dungeon_location_name,
                created_at: dungeonActionEntity.created_at,
                updated_at: dungeonActionEntity.updated_at || undefined,
            },
            // The location the action occurred
            location: {
                name: dungeonLocationEntity.name,
                description: dungeonLocationEntity.description,
            },
            // Characters at the location
            characters: [],
            // Monsters at the location
            monsters: [],
            // Objects at the location
            objects: [],
        };

        // The character that performed the action
        const dungeonCharacterEntity = dungeonActionEntitySet.dungeonCharacterEntity;
        if (dungeonCharacterEntity) {
            dungeonActionDataItem.character = {
                name: dungeonCharacterEntity.name,
            };
        }

        // The monster that performed the action
        const dungeonMonsterEntity = dungeonActionEntitySet.dungeonMonsterEntity;
        if (dungeonMonsterEntity) {
            dungeonActionDataItem.monster = {
                name: dungeonMonsterEntity.name,
            };
        }

        // The characters at the location when the action was performed
        const dungeonCharacterEntities = dungeonActionEntitySet.dungeonCharacterEntities;
        if (dungeonCharacterEntities) {
            dungeonActionDataItem.characters = [];
            dungeonCharacterEntities.forEach((dungeonCharacterEntity) => {
                dungeonActionDataItem.characters.push({
                    name: dungeonCharacterEntity.name,
                });
            });
        }

        // The monsters at the location when the action was performed
        const dungeonMonsterEntities = dungeonActionEntitySet.dungeonMonsterEntities;
        if (dungeonMonsterEntities) {
            dungeonActionDataItem.monsters = [];
            dungeonMonsterEntities.forEach((dungeonMonsterEntity) => {
                dungeonActionDataItem.monsters.push({
                    name: dungeonMonsterEntity.name,
                });
            });
        }

        // The objects at the location when the action was performed
        const dungeonObjectEntities = dungeonActionEntitySet.dungeonObjectEntities;
        if (dungeonObjectEntities) {
            dungeonActionDataItem.objects = [];
            dungeonObjectEntities.forEach((dungeonObjectEntity) => {
                dungeonActionDataItem.objects.push({
                    name: dungeonObjectEntity.name,
                });
            });
        }

        dungeonActionData.push(dungeonActionDataItem);
    });

    returnData = { data: dungeonActionData };

    return returnData;
}
