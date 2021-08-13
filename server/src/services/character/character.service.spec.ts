import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';

// Application
import { DatabaseModule, LoggerModule, LoggerService } from '@/core';
import { CharacterService } from './character.service';
import { LocationService } from '../location/location.service';
import {
    RepositoriesModule,
    CharacterRepositoryRecord,
    LocationRepositoryRecord,
} from '@/repositories';

describe('CharacterService', () => {
    let service: CharacterService;
    let locationService: LocationService;
    let characterService: CharacterService;
    let locationRecord: LocationRepositoryRecord;
    let characterRecord: CharacterRepositoryRecord;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ ignoreEnvFile: false }),
                DatabaseModule,
                LoggerModule,
                RepositoriesModule,
            ],
            providers: [
                LoggerService,
                LocationService,
                CharacterService,
                CharacterService,
            ],
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
