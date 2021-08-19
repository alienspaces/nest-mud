import {
    Controller,
    Post,
    Put,
    Body,
    Param,
    UsePipes,
    NotFoundException,
    Get,
} from '@nestjs/common';

// Application
import { LoggerService } from '@/core';
import { ValidationPipe } from '@/pipes/validation/validation.pipe';
import {
    DungeonService,
    CreateDungeonEntity,
    UpdateDungeonEntity,
    DungeonEntity,
} from '@/services';
import * as dungeonSchema from './schema/dungeon.schema.json';
import { DungeonDto } from './dto';

@Controller('/api/v1/dungeons/')
export class DungeonController {
    constructor(
        private loggerService: LoggerService,
        private dungeonService: DungeonService,
    ) {}

    @Get()
    async getOne(@Param('dungeon_id') dungeon_id: string): Promise<DungeonDto> {
        const logger = this.loggerService.logger({
            class: 'DungeonController',
            function: 'getOne',
        });

        logger.debug(`Getting dungeon ID ${dungeon_id}`);

        const dungeonEntity = await this.dungeonService.getDungeon(dungeon_id);

        const responseData = buildResponse([dungeonEntity]);
        return responseData;
    }

    @Get()
    async getMany(): Promise<DungeonDto> {
        const logger = this.loggerService.logger({
            class: 'DungeonController',
            function: 'getMany',
        });

        logger.debug(`Getting dungeons`);

        const dungeonEntities = await this.dungeonService.getDungeons();

        const responseData = buildResponse(dungeonEntities);
        return responseData;
    }
}

function buildResponse(dungeonEntities: DungeonEntity[]): DungeonDto {
    let returnData: DungeonDto;
    if (!dungeonEntities) {
        return returnData;
    }

    let returnDataCharacters: DungeonDto['data'] = [];

    dungeonEntities.forEach((data) => {
        returnDataCharacters.push({
            id: data.id,
            name: data.name,
            created_at: data.created_at,
            updated_at: data.updated_at,
        });
    });

    returnData = { data: returnDataCharacters };

    return returnData;
}
