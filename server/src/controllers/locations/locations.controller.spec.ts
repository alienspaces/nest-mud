import { Test, TestingModule } from '@nestjs/testing';

// Application
import { LocationsController } from './locations.controller';
import { LocationsService } from '@/services/locations/locations.service';

describe('LocationsController', () => {
    let controller: LocationsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LocationsController],
            providers: [LocationsService],
        }).compile();

        controller = module.get<LocationsController>(LocationsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
