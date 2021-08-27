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
    CreateDungeonActionEntity,
    DungeonActionEntity,
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

        const createDungeonActionEntity =
            await this.dungeonCharacterActionService.resolveDungeonCharacterAction(
                character_id,
                requestData.data.sentence,
            );

        const DungeonActionEntity =
            await this.dungeonCharacterActionService.createDungeonCharacterAction(
                createDungeonActionEntity,
            );

        const responseData = buildResponse(requestData.data.sentence, [
            DungeonActionEntity,
        ]);

        return responseData;
    }
}

function buildResponse(
    sentence: string,
    dungeonCharacterActionEntities: DungeonActionEntity[],
): DungeonCharacterActionDto {
    let returnData: DungeonCharacterActionDto;
    if (!dungeonCharacterActionEntities) {
        return returnData;
    }

    let returnDataCharacterActions: DungeonCharacterActionDto['data'] = [];

    dungeonCharacterActionEntities.forEach((data) => {
        returnDataCharacterActions.push({
            id: data.id,
            created_at: data.created_at,
            updated_at: data.updated_at || undefined,
        });
    });

    returnData = { data: returnDataCharacterActions };

    return returnData;
}
