import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

// Application
import { AppModule } from '@/app.module';
import {
    Data,
    DataModule,
    DataService,
    defaultDataConfig,
} from '@/common/data';
import { Schema } from '@/core/schema/schema';
import * as dungeonLocationSchema from '@/controllers/dungeon-location/schema/dungeon-location.schema.json';

describe('Dungeon Location (e2e)', () => {
    let app: INestApplication;
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [AppModule, DataModule],
        }).compile();
    });

    beforeEach(async () => {
        app = module.createNestApplication();
        await app.init();
    });

    it('/api/v1/dungeons/:dungeon_id/locations (GET)', async () => {
        const service = await module.resolve<DataService>(DataService);
        const data = new Data();
        await expect(
            service.setup(defaultDataConfig(), data),
        ).resolves.not.toThrow();

        const response = await request(app.getHttpServer()).get(
            `/api/v1/dungeons/${data.dungeonEntities[0].id}/locations`,
        );
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(200);
        expect(response.body).toBeDefined();
        expect(
            Schema.validate(
                dungeonLocationSchema.$id,
                dungeonLocationSchema,
                response.body,
            ),
        ).toBeNull();

        await expect(service.teardown(data)).resolves.not.toThrow();
    });

    it('/api/v1/dungeons/:dungeon_id/locations/:location_id (GET)', async () => {
        const service = await module.resolve<DataService>(DataService);
        const data = new Data();
        await expect(
            service.setup(defaultDataConfig(), data),
        ).resolves.not.toThrow();

        const response = await request(app.getHttpServer()).get(
            `/api/v1/dungeons/${data.dungeonEntities[0].id}/locations/${data.dungeonLocationEntities[0].id}`,
        );
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(200);
        expect(response.body).toBeDefined();
        expect(
            Schema.validate(
                dungeonLocationSchema.$id,
                dungeonLocationSchema,
                response.body,
            ),
        ).toBeNull();

        await expect(service.teardown(data)).resolves.not.toThrow();
    });
});
