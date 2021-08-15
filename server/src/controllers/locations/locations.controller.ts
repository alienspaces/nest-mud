import { Controller, Get, Param, Query } from '@nestjs/common';

// Application
import { LoggerService } from '@/core';
import {
    DungeonService,
    DungeonLocationEntity,
    DungeonLocationParameters,
} from '@/services';
import { LocationDto } from './dto';

@Controller('/api/v1/locations')
export class LocationsController {
    constructor(
        private loggerService: LoggerService,
        private dungeonService: DungeonService,
    ) {}

    @Get(':id')
    async get(@Param('id') id: string): Promise<LocationDto> {
        const locationEntity = await this.dungeonService.getDungeonLocation(id);
        if (!locationEntity) {
            return;
        }
        const responseData = buildResponse([locationEntity]);
        return responseData;
    }
}

function buildResponse(locationEntities: DungeonLocationEntity[]): LocationDto {
    let returnDataLocations: LocationDto['data'] = [];

    locationEntities.forEach((data) => {
        returnDataLocations.push({
            id: data.id,
            dungeon_id: data.dungeon_id,
            name: data.name,
            description: data.description,
            default: data.default,
            north_dungeon_location_id: data.north_dungeon_location_id,
            northeast_dungeon_location_id: data.northeast_dungeon_location_id,
            east_dungeon_location_id: data.east_dungeon_location_id,
            southeast_dungeon_location_id: data.southeast_dungeon_location_id,
            south_dungeon_location_id: data.south_dungeon_location_id,
            southwest_dungeon_location_id: data.southwest_dungeon_location_id,
            west_dungeon_location_id: data.west_dungeon_location_id,
            northwest_dungeon_location_id: data.northwest_dungeon_location_id,
            up_dungeon_location_id: data.up_dungeon_location_id,
            down_dungeon_location_id: data.down_dungeon_location_id,
            created_at: data.created_at,
            updated_at: data.updated_at,
        });
    });

    const returnData = { data: returnDataLocations };

    return returnData;
}
