import {
    Controller,
    Get,
    Post,
    Put,
    Body,
    Param,
    UsePipes,
    NotFoundException,
} from '@nestjs/common';

// Application
import { LoggerService } from '@/core';
import { ValidationPipe } from '@/pipes/validation/validation.pipe';
import {
    DungeonCharacterActionService,
    CreateDungeonCharacterActionEntity,
    DungeonCharacterActionEntity,
} from '@/services';
import * as createDungeonCharacterActionSchema from './schema/create-dungeon-character-action.schema.json';
import {
    CreateDungeonCharacterActionDto,
    DungeonCharacterActionDto,
} from './dto';

@Controller('/api/v1/dungeons/:dungeon_id/characters/:character_id/actions')
export class DungeonCharacterActionController {
    constructor(
        private loggerService: LoggerService,
        private dungeonCharacterActionService: DungeonCharacterActionService,
    ) {}

    @UsePipes(
        new ValidationPipe(
            createDungeonCharacterActionSchema.$id,
            createDungeonCharacterActionSchema,
        ),
    )
    @Post()
    async create(
        @Param('dungeon_id') dungeon_id: string,
        @Param('character_id') character_id: string,
        @Body() requestData: CreateDungeonCharacterActionDto,
    ): Promise<DungeonCharacterActionDto> {
        const logger = this.loggerService.logger({
            class: 'DungeonCharacterActionController',
            function: 'create',
        });

        logger.debug('Creating dungeon character action');

        const createDungeonCharacterActionEntity: CreateDungeonCharacterActionEntity =
            {
                character_id: character_id,
                action: requestData.data.action,
            };

        const dungeonCharacterActionEntity =
            await this.dungeonCharacterActionService.createDungeonCharacterAction(
                createDungeonCharacterActionEntity,
            );

        const responseData: DungeonCharacterActionDto = {
            data: [
                {
                    id: dungeonCharacterActionEntity.id,
                    action: dungeonCharacterActionEntity.action,
                    created_at: dungeonCharacterActionEntity.created_at,
                    updated_at: dungeonCharacterActionEntity.updated_at,
                },
            ],
        };

        return responseData;
    }
}

function buildResponse(
    dungeonCharacterActionEntities: DungeonCharacterActionEntity[],
): DungeonCharacterActionDto {
    let returnData: DungeonCharacterActionDto;
    if (!dungeonCharacterActionEntities) {
        return returnData;
    }

    let returnDataCharacterActions: DungeonCharacterActionDto['data'] = [];

    dungeonCharacterActionEntities.forEach((data) => {
        returnDataCharacterActions.push({
            id: data.id,
            action: data.action,
            created_at: data.created_at,
            updated_at: data.updated_at || undefined,
        });
    });

    returnData = { data: returnDataCharacterActions };

    return returnData;
}
