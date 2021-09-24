import { Controller, Get, Post, Put, Body, Param, UsePipes, NotFoundException, ParseUUIDPipe } from '@nestjs/common';

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
        @Param('dungeon_id', new ParseUUIDPipe({ version: '4' })) dungeon_id: string,
        @Param('character_id', new ParseUUIDPipe({ version: '4' })) character_id: string,
        @Body() requestData: CreateDungeonActionDto,
    ): Promise<DungeonActionDto> {
        const logger = this.loggerService.logger({
            class: 'DungeonCharacterActionController',
            function: 'create',
        });

        logger.info('Creating dungeon character action');

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

    for (var dungeonActionEntitySet of dungeonActionEntitySets) {
        const dungeonActionEntity = dungeonActionEntitySet.dungeonActionEntity;
        const dungeonLocationEntity = dungeonActionEntitySet.dungeonLocationEntity;

        const dungeonActionDataItem: DungeonActionDataDto = {
            // The action that occurred
            action: {
                id: dungeonActionEntity.id,
                command: dungeonActionEntity.resolved_command,
                command_result: '',
                equipped_dungeon_object_name: dungeonActionEntity.resolved_equipped_dungeon_object_name || undefined,
                stashed_dungeon_object_name: dungeonActionEntity.resolved_stashed_dungeon_object_name || undefined,
                target_dungeon_object_name: dungeonActionEntity.resolved_target_dungeon_object_name || undefined,
                target_dungeon_character_name: dungeonActionEntity.resolved_target_dungeon_character_name || undefined,
                target_dungeon_monster_name: dungeonActionEntity.resolved_target_dungeon_monster_name || undefined,
                target_dungeon_location_direction:
                    dungeonActionEntity.resolved_target_dungeon_location_direction || undefined,
                target_dungeon_location_name: dungeonActionEntity.resolved_target_dungeon_location_name || undefined,
                created_at: dungeonActionEntity.created_at,
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
            for (var locationDungeonCharacterEntity of dungeonCharacterEntities) {
                dungeonActionDataItem.characters.push({
                    name: locationDungeonCharacterEntity.name,
                });
            }
        }

        // The monsters at the location when the action was performed
        const dungeonMonsterEntities = dungeonActionEntitySet.dungeonMonsterEntities;
        if (dungeonMonsterEntities) {
            dungeonActionDataItem.monsters = [];
            for (var locationDungeonMonsterEntity of dungeonMonsterEntities) {
                dungeonActionDataItem.monsters.push({
                    name: locationDungeonMonsterEntity.name,
                });
            }
        }

        // The objects at the location when the action was performed
        const dungeonObjectEntities = dungeonActionEntitySet.dungeonObjectEntities;
        if (dungeonObjectEntities) {
            dungeonActionDataItem.objects = [];
            for (var locationDungeonObjectEntity of dungeonObjectEntities) {
                dungeonActionDataItem.objects.push({
                    name: locationDungeonObjectEntity.name,
                });
            }
        }

        dungeonActionData.push(dungeonActionDataItem);
    }

    returnData = { data: dungeonActionData };

    return returnData;
}
