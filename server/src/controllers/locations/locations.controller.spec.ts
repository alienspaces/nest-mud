import { Test, TestingModule } from '@nestjs/testing';

// Application
import { LocationsController } from './locations.controller';
import { LocationResponseDto } from './dto/location-response.dto';
import { LocationService } from '@/services/location/location.service';

describe('LocationsController', () => {
    let controller: LocationsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LocationsController],
            providers: [LocationService],
        }).compile();

        controller = module.get<LocationsController>(LocationsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getMany', () => {
        it('should return many', async () => {
            let response = await controller.getMany();
            expect(response.data).toBeTruthy();
        });
    });
});
