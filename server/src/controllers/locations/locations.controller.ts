import { Controller, Get, Param, Query } from '@nestjs/common';

// Application
import { LoggerService } from '@/core';
import {
    LocationService,
    LocationEntity,
    LocationParameters,
} from '@/services';
import { LocationDto } from './dto';

@Controller('/api/v1/locations')
export class LocationsController {
    constructor(
        private loggerService: LoggerService,
        private locationsService: LocationService,
    ) {}

    @Get(':id')
    async get(@Param('id') id: string): Promise<LocationDto> {
        const locationEntity = await this.locationsService.getLocation(id);
        if (!locationEntity) {
            return;
        }
        const responseData = buildResponse([locationEntity]);
        return responseData;
    }
}

function buildResponse(locationEntities: LocationEntity[]): LocationDto {
    let returnDataLocations: LocationDto['data'] = [];

    locationEntities.forEach((data) => {
        returnDataLocations.push({
            id: data.id,
            name: data.name,
            description: data.description,
            default: data.default,
            north_location_id: data.north_location_id,
            northeast_location_id: data.northeast_location_id,
            east_location_id: data.east_location_id,
            southeast_location_id: data.southeast_location_id,
            south_location_id: data.south_location_id,
            southwest_location_id: data.southwest_location_id,
            west_location_id: data.west_location_id,
            northwest_location_id: data.northwest_location_id,
            up_location_id: data.up_location_id,
            down_location_id: data.down_location_id,
            created_at: data.created_at,
            updated_at: data.updated_at,
        });
    });

    const returnData = { data: returnDataLocations };

    return returnData;
}
