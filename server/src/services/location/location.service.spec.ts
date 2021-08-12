import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';

// Application
import { DatabaseModule } from '@/core';
import { RepositoriesModule } from '@/repositories/repositories.module';
import { LocationService } from '../location/location.service';
import { LocationRepositoryRecord } from '@/repositories';

describe('LocationService', () => {
    let service: LocationService;
    let locationRecord: LocationRepositoryRecord;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ ignoreEnvFile: false }),
                DatabaseModule,
                RepositoriesModule,
            ],
            providers: [LocationService],
        }).compile();

        service = module.get<LocationService>(LocationService);
    });

    afterAll(async () => {});

    beforeEach(async () => {
        // TODO: Create location records
    });

    afterEach(async () => {
        // TODO: Remove location records
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
