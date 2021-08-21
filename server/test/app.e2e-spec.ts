import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

// Application
import { AppModule } from '../src/app.module';
import { AppService } from '../src/app.service';
import {
    Data,
    DataModule,
    DataService,
    defaultDataConfig,
} from '@/common/data';

describe('App (e2e)', () => {
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

    it('/ (GET)', async () => {
        const service = await module.resolve<DataService>(DataService);
        const data = new Data();
        await expect(
            service.setup(defaultDataConfig(), data),
        ).resolves.not.toThrow();

        const response = await request(app.getHttpServer()).get('/');
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(200);
        expect(response.text).toEqual(AppService.content());

        await expect(service.teardown(data)).resolves.not.toThrow();
    });
});
