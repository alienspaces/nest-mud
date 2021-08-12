import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';

// Application
import { DatabaseModule } from '@/core';
import { RepositoriesModule } from '@/repositories/repositories.module';
import { CharactersService } from './characters.service';
import { LocationsService } from '../locations/locations.service';
import { CharacterRecord, LocationRecord } from '@/repositories';

describe('CharactersService', () => {
    let service: CharactersService;
    let locationsService: LocationsService;
    let charactersService: CharactersService;
    let locationRecord: LocationRecord;
    let characterRecord: CharacterRecord;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ ignoreEnvFile: false }),
                DatabaseModule,
                RepositoriesModule,
            ],
            providers: [LocationsService, CharactersService, CharactersService],
        }).compile();

        locationsService = await module.resolve<LocationsService>(
            LocationsService,
        );
        charactersService = await module.resolve<CharactersService>(
            CharactersService,
        );
        service = module.get<CharactersService>(CharactersService);
    });

    afterAll(async () => {});

    beforeEach(async () => {
        // TODO: Create location and character records
    });

    afterEach(async () => {
        // TODO: Remove location and character records
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
