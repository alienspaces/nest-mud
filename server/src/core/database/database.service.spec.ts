import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Application
import { DatabaseService } from './database.service';
import { LoggerModule } from '@/core/logger/logger.module';

describe('DatabaseService', () => {
    let service: DatabaseService;
    let configService: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot({ ignoreEnvFile: false }), LoggerModule],
            providers: [DatabaseService, ConfigService],
        }).compile();

        // NOTE: Request scoped service is async resolved
        service = await module.resolve<DatabaseService>(DatabaseService);
    });

    afterEach(() => {
        if (service != null) {
            service.end();
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
