import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

// Application
import { AppModule } from '@/app.module';
import { Data, DataModule, DataService, defaultDataConfig } from '@/common/data';
import { Schema } from '@/core/schema/schema';
import * as dungeonActionSchema from '@/controllers/dungeon-action/schema/dungeon-action.schema.json';
import { DungeonActionDataDto } from '@/controllers/dungeon-action/dto/dungeon-action.dto';

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

    interface TestCase {
        name: string;
        urlFunc: (data: Data) => string;
        requestData: any;
        responseCode: number;
    }

    const testCases: TestCase[] = [
        {
            name: 'Move character north',
            urlFunc: (data: Data) => {
                return `/api/v1/dungeons/${data.dungeonEntities[0].id}/characters/${data.dungeonCharacterEntities[0].id}/actions`;
            },
            requestData: {
                data: {
                    sentence: 'move north',
                },
            },
            responseCode: 201,
        },
        {
            name: 'Move character east',
            urlFunc: (data: Data) => {
                return `/api/v1/dungeons/${data.dungeonEntities[0].id}/characters/${data.dungeonCharacterEntities[0].id}/actions`;
            },
            requestData: {
                data: {
                    sentence: 'move east',
                },
            },
            responseCode: 400,
        },
        {
            name: 'Look',
            urlFunc: (data: Data) => {
                return `/api/v1/dungeons/${data.dungeonEntities[0].id}/characters/${data.dungeonCharacterEntities[0].id}/actions`;
            },
            requestData: {
                data: {
                    sentence: 'look',
                },
            },
            responseCode: 400,
        },
    ];

    testCases.forEach((testCase: TestCase) => {
        //
        it(testCase.name, async () => {
            const service = await module.resolve<DataService>(DataService);
            const data = new Data();
            await expect(service.setup(defaultDataConfig(), data, true)).resolves.not.toThrow();
            const url = testCase.urlFunc(data);
            const response = await request(app.getHttpServer()).post(url).send(testCase.requestData);

            expect(response).toBeDefined();
            expect(response.statusCode).toEqual(testCase.responseCode);
            expect(response.body).toBeDefined();

            if (testCase.responseCode < 300) {
                expect(response.body.data).toBeDefined();
                expect(response.body.data.length).toEqual(1);

                expect(Schema.validate(dungeonActionSchema.$id, dungeonActionSchema, response.body)).toBeNull();

                response.body.data.forEach((responseData: DungeonActionDataDto) => {
                    data.addActionTeardownId(responseData.action.id);
                });
            }
            await expect(service.teardown(data)).resolves.not.toThrow();
        });
    });
});
