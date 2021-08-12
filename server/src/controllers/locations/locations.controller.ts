import { Controller, Get } from '@nestjs/common';

// Application
import {
    LocationService,
    LocationEntity,
    LocationParameters,
} from '@/services';
import { LocationResponseDto } from './dto/location-response.dto';
import { LocationDto } from './dto/location.dto';

@Controller('/api/v1/locations')
export class LocationsController {
    constructor(private locationsService: LocationService) {}

    @Get()
    async getMany(): Promise<LocationResponseDto> {
        const locationsData = await this.locationsService.getLocations();
        const locations = buildDto(locationsData);
        return {
            data: locations,
        };
    }
}

function buildDto(collection: LocationEntity[]): LocationDto[] {
    const returnData: LocationDto[] = [];
    if (!collection) {
        return returnData;
    }

    collection.forEach((data) => {
        returnData.push({
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
    return returnData;
}
