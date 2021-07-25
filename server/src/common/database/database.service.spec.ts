import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Application
import { DatabaseService } from './database.service';
import { doesNotMatch } from 'assert';

describe('DatabaseService', () => {
    let service: DatabaseService;
    let configService: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot({ ignoreEnvFile: true })],
            providers: [DatabaseService, ConfigService],
        }).compile();

        service = await module.resolve<DatabaseService>(DatabaseService);
    });

    afterEach(() => {
        if (service != null) {
            service.release();
            DatabaseService.poolEnd();
        }
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should provide a connected client', async () => {
        const client = await service.connect();
        expect(client).toBeTruthy();
    });
});