import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

// Application
import { AppModule } from '@/app.module';
import { Data, DataModule, DataService, defaultDataConfig } from '@/common/data';
import { Schema } from '@/core/schema/schema';
import * as dungeonActionSchema from '@/controllers/dungeon-action/schema/dungeon-action.schema.json';

describe('Dungeon Character Action (e2e)', () => {
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

    it('/api/v1/dungeons/:dungeon_id/characters/:character_id/actions (POST)', async () => {
        const service = await module.resolve<DataService>(DataService);
        const data = new Data();
        await expect(service.setup(defaultDataConfig(), data, true)).resolves.not.toThrow();

        const response = await request(app.getHttpServer())
            .post(
                `/api/v1/dungeons/${data.dungeonEntities[0].id}/characters/${data.dungeonCharacterEntities[0].id}/actions`,
            )
            .send({
                data: {
                    sentence: 'move north',
                },
            });

        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(201);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.length).toEqual(1);

        expect(Schema.validate(dungeonActionSchema.$id, dungeonActionSchema, response.body)).toBeNull();

        response.body.data.forEach((responseData) => {
            data.addActionTeardownId(responseData.action.id);
        });
        await expect(service.teardown(data)).resolves.not.toThrow();
    });
});
