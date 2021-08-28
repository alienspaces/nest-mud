import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';

// Application
import { LoggerService } from '@/core';
import { DungeonService, DungeonLocationService, DungeonLocationEntity, DungeonLocationParameters } from '@/services';
import { DungeonLocationDto } from './dto';

@Controller('/api/v1/dungeons/:dungeon_id/locations')
export class DungeonLocationsController {
    constructor(private loggerService: LoggerService, private dungeonLocationService: DungeonLocationService) {}

    @Get()
    async getMany(@Param('dungeon_id') dungeon_id: string): Promise<DungeonLocationDto> {
        const locationEntities = await this.dungeonLocationService.getDungeonLocations({
            dungeon_id: dungeon_id,
        });
        const responseData = buildResponse(locationEntities);
        return responseData;
    }

    @Get('/:location_id')
    async get(
        @Param('dungeon_id') dungeon_id: string,
        @Param('location_id') location_id: string,
    ): Promise<DungeonLocationDto> {
        const logger = this.loggerService.logger({
            class: 'DungeonLocationsController',
            function: 'get',
        });

        logger.debug(`Getting dungeon ID ${dungeon_id} location ID ${location_id}`);

        const locationEntity = await this.dungeonLocationService.getDungeonLocation(location_id);
        if (!locationEntity) {
            logger.error('Failed getting dungeon location entity');
            throw new NotFoundException();
        }
        if (locationEntity.dungeon_id !== dungeon_id) {
            logger.error('Dungeon location entity requested does not belong to requested dungeon');
            throw new NotFoundException();
        }
        const responseData = buildResponse([locationEntity]);
        return responseData;
    }
}

function buildResponse(locationEntities: DungeonLocationEntity[]): DungeonLocationDto {
    let returnDataLocations: DungeonLocationDto['data'] = [];

    locationEntities.forEach((data) => {
        returnDataLocations.push({
            id: data.id,
            dungeon_id: data.dungeon_id,
            name: data.name,
            description: data.description,
            default: data.default,
            north_dungeon_location_id: data.north_dungeon_location_id || undefined,
            northeast_dungeon_location_id: data.northeast_dungeon_location_id || undefined,
            east_dungeon_location_id: data.east_dungeon_location_id || undefined,
            southeast_dungeon_location_id: data.southeast_dungeon_location_id || undefined,
            south_dungeon_location_id: data.south_dungeon_location_id || undefined,
            southwest_dungeon_location_id: data.southwest_dungeon_location_id || undefined,
            west_dungeon_location_id: data.west_dungeon_location_id || undefined,
            northwest_dungeon_location_id: data.northwest_dungeon_location_id || undefined,
            up_dungeon_location_id: data.up_dungeon_location_id || undefined,
            down_dungeon_location_id: data.down_dungeon_location_id || undefined,
            created_at: data.created_at,
            updated_at: data.updated_at || undefined,
        });
    });

    const returnData = { data: returnDataLocations };

    return returnData;
}
