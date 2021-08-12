import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';

// Application
import { DatabaseModule } from '@/core';
import { RepositoriesModule } from '@/repositories/repositories.module';
import { CharacterService } from './character.service';
import { LocationService } from '../location/location.service';
import { CharacterRecord, LocationRecord } from '@/repositories';

describe('CharacterService', () => {
    let service: CharacterService;
    let locationService: LocationService;
    let characterService: CharacterService;
    let locationRecord: LocationRecord;
    let characterRecord: CharacterRecord;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ ignoreEnvFile: false }),
                DatabaseModule,
                RepositoriesModule,
            ],
            providers: [LocationService, CharacterService, CharacterService],
        }).compile();

        locationService = await module.resolve<LocationService>(
            LocationService,
        );
        characterService = await module.resolve<CharacterService>(
            CharacterService,
        );
        service = module.get<CharacterService>(CharacterService);
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
