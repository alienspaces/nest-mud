import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import * as crypto from 'crypto';

// Application
import { DatabaseModule, LoggerModule, LoggerService } from '@/core';
import { RepositoriesModule } from '@/repositories';
import {
    Data,
    DataModule,
    DataService,
    defaultDataConfig,
} from '@/common/data';
import { ServicesModule } from '@/services/services.module';
import { DungeonCharacterActionService } from './dungeon-action.service';

describe('ActionsService', () => {
    let service: DungeonCharacterActionService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ ignoreEnvFile: false }),
                DatabaseModule,
                LoggerModule,
                ServicesModule,
                RepositoriesModule,
                DataModule,
            ],
            providers: [DungeonCharacterActionService],
        }).compile();

        service = await module.resolve<DungeonCharacterActionService>(
            DungeonCharacterActionService,
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
