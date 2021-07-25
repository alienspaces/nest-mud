import { Controller, Get } from '@nestjs/common';

// Application
import { LocationsService } from '@/services/locations/locations.service';
import { LocationResponseDto } from './dto/location-response.dto';
import { LocationDto } from './dto/location.dto';
import { Location } from '@/interfaces/location.interface';

@Controller('/api/v1/locations')
export class LocationsController {
    constructor(private locationsService: LocationsService) {}

    @Get()
    async getMany(): Promise<LocationResponseDto> {
        const locationsData = this.locationsService.getMany();
        const locations = convertToDto(locationsData);
        return {
            data: locations,
        };
    }
}

function convertToDto(collection: Location[]): LocationDto[] {
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
            north: data.north,
            northeast: data.northeast,
            east: data.east,
            southeast: data.southeast,
            south: data.south,
            southwest: data.southwest,
            west: data.west,
            northwest: data.northwest,
            up: data.up,
            down: data.down,
            created_at: data.created_at,
            updated_at: data.updated_at,
        });
    });
    return returnData;
}
