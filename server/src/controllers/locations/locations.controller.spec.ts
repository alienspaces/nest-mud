import { Test, TestingModule } from '@nestjs/testing';
import { ContextIdFactory } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

// Application
import {
    DatabaseModule,
    DatabaseService,
    LoggerModule,
    LoggerService,
} from '@/core';
import {
    LocationService,
    CreateLocationEntity,
    LocationEntity,
    ServicesModule,
} from '@/services';
import { LocationsController } from './locations.controller';
import { RepositoriesModule } from '@/repositories';

describe('LocationsController', () => {
    let controller: LocationsController;
    let databaseService: DatabaseService;
    let locationService: LocationService;
    let locationEntities: LocationEntity[] = [];

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ ignoreEnvFile: false }),
                LoggerModule,
                DatabaseModule,
                RepositoriesModule,
                ServicesModule,
            ],
            controllers: [LocationsController],
            providers: [LoggerService, LocationService],
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
        locationEntities.push(locationEntity);
    });

    afterEach(async () => {
        while (locationEntities.length) {
            const locationEntity = locationEntities.pop();
            await locationService.deleteLocation(locationEntity.id);
        }
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('get', () => {
        it('should return one location', async () => {
            let response = await controller.get(locationEntities[0].id);
            expect(response.data).toBeTruthy();
            expect(response.data.length).toEqual(1);
        });
    });
});
