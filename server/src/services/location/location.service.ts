import { Injectable } from '@nestjs/common';

// Application
import {
    LocationRepository,
    LocationRepositoryRecord,
    LocationRepositoryParameter,
} from '@/repositories';

import { CreateLocationEntity, LocationEntity } from './location.entities';

export interface LocationParameters {
    name?: string;
    description?: string;
    default?: boolean;
    north_location_id?: string;
    northeast_location_id?: string;
    east_location_id?: string;
    southeast_location_id?: string;
    south_location_id?: string;
    southwest_location_id?: string;
    west_location_id?: string;
    northwest_location_id?: string;
    up_location_id?: string;
}

@Injectable()
export class LocationService {
    constructor(private locationRepository: LocationRepository) {}

    async getLocation(id: string): Promise<LocationEntity> {
        return null;
    }

    async getLocations(
        parameters?: LocationParameters,
    ): Promise<LocationEntity[]> {
        const repositoryParameters: LocationRepositoryParameter[] = [];

        // TODO: Can probably write a generic function for this however directly
        // mapping service parameters to repository parameters is probably not
        // going to be a consistent pattern..
        for (var key in parameters) {
            if (parameters.hasOwnProperty(key)) {
                console.log(key + ' -> ' + parameters[key]);
                repositoryParameters.push({
                    column: key,
                    value: parameters[key],
                } as LocationRepositoryParameter);
            }
        }

        const locationRecords = await this.locationRepository.getMany({
            parameters: repositoryParameters,
        });

        const locationEntities: LocationEntity[] = [];
        locationRecords.forEach((locationRecord) => {
            locationEntities.push(this.buildLocationEntity(locationRecord));
        });

        return locationEntities;
    }

    async createLocation(
        createLocationEntity: CreateLocationEntity,
    ): Promise<LocationEntity> {
        const locationRecord: LocationRepositoryRecord = {
            name: createLocationEntity.name,
            description: createLocationEntity.description,
            default: createLocationEntity.default,
            north_location_id: createLocationEntity.north_location_id,
            northeast_location_id: createLocationEntity.northeast_location_id,
            east_location_id: createLocationEntity.east_location_id,
            southeast_location_id: createLocationEntity.southeast_location_id,
            south_location_id: createLocationEntity.south_location_id,
            southwest_location_id: createLocationEntity.southwest_location_id,
            west_location_id: createLocationEntity.west_location_id,
            northwest_location_id: createLocationEntity.northwest_location_id,
            up_location_id: createLocationEntity.up_location_id,
            down_location_id: createLocationEntity.down_location_id,
        };

        await this.locationRepository.insertOne({
            record: locationRecord,
        });

        const locationEntity = this.buildLocationEntity(locationRecord);

        return locationEntity;
    }

    async updateLocation(locationEntity: LocationEntity): Promise<void> {
        return null;
    }

    async deleteLocation(id: string): Promise<void> {
        await this.locationRepository.deleteOne({ id: id });
        return;
    }

    buildLocationEntity(
        locationRecord: LocationRepositoryRecord,
    ): LocationEntity {
        const locationEntity: LocationEntity = {
            id: locationRecord.id,
            name: locationRecord.name,
            description: locationRecord.description,
            default: locationRecord.default,
            north_location_id: locationRecord.north_location_id,
            northeast_location_id: locationRecord.northeast_location_id,
            east_location_id: locationRecord.east_location_id,
            southeast_location_id: locationRecord.southeast_location_id,
            south_location_id: locationRecord.south_location_id,
            southwest_location_id: locationRecord.southwest_location_id,
            west_location_id: locationRecord.west_location_id,
            northwest_location_id: locationRecord.northwest_location_id,
            up_location_id: locationRecord.up_location_id,
            down_location_id: locationRecord.down_location_id,
            created_at: locationRecord.created_at,
            updated_at: locationRecord.updated_at,
            deleted_at: locationRecord.deleted_at,
        };
        return locationEntity;
    }
}
