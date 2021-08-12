import { Test, TestingModule } from '@nestjs/testing';
import { ContextIdFactory } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

// Application
import { DatabaseModule, DatabaseService } from '@/core';
import { LocationsController } from './locations.controller';
import { LocationResponseDto } from './dto/location-response.dto';
import { LocationService } from '@/services/location/location.service';
import { ServicesModule } from '@/services';
import { skip } from 'rxjs';

describe('LocationsController', () => {
    let controller: LocationsController;
    let databaseService: DatabaseService;

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
        controller = await module.resolve<LocationsController>(
            LocationsController,
            contextId,
        );
    });

    afterAll(async () => {
        await databaseService.end();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getMany', () => {
        // TODO:
        it('should return many', async () => {
            let response = await controller.getMany();
            expect(response.data).toBeTruthy();
        });
    });
});
