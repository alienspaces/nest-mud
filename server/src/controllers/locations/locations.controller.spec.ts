import { Test, TestingModule } from '@nestjs/testing';
import { ContextIdFactory } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

// Application
import { DatabaseModule, DatabaseService } from '@/core';
import { LocationsController } from './locations.controller';
import { LocationResponseDto } from './dto/location-response.dto';
import { LocationService } from '@/services/location/location.service';
import {
    CreateLocationEntity,
    LocationEntity,
    ServicesModule,
} from '@/services';

describe('LocationsController', () => {
    let controller: LocationsController;
    let databaseService: DatabaseService;
    let locationService: LocationService;
    let locationEntities: LocationEntity[] = [];

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ ignoreEnvFile: false }),
                DatabaseModule,
                ServicesModule,
            ],
            controllers: [LocationsController],
        }).compile();

        const contextId = ContextIdFactory.create();
        databaseService = await module.resolve<DatabaseService>(
            DatabaseService,
            contextId,
        );
        locationService = await module.resolve<LocationService>(
            LocationService,
            contextId,
        );
        controller = await module.resolve<LocationsController>(
            LocationsController,
            contextId,
        );
    });

    afterAll(async () => {
        while (locationEntities.length) {
            const locationEntity = locationEntities.pop();
            await locationService.deleteLocation(locationEntity.id);
            console.log(`(afterEach) Deleted location ${locationEntity.id}`);
        }
        await databaseService.end();
    });

    beforeEach(async () => {
        const createLocationEntity: CreateLocationEntity = {
            name: 'Test Location',
            description: 'Test Location Description',
            default: true,
        };
        const locationEntity = await locationService.createLocation(
            createLocationEntity,
        );
        console.log(`(beforeEach) Created location ${locationEntity.id}`);
        locationEntities.push(locationEntity);
    });

    afterEach(async () => {
        while (locationEntities.length) {
            const locationEntity = locationEntities.pop();
            await locationService.deleteLocation(locationEntity.id);
            console.log(`(afterEach) Deleted location ${locationEntity.id}`);
        }
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    // describe('getMany', () => {
    //     it('should return many', async () => {
    //         let response = await controller.getMany();
    //         expect(response.data).toBeTruthy();
    //         expect(response.data.length).toEqual(1);
    //     });
    // });
});
