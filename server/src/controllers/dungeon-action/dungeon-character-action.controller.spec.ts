import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';

// Application
import { DatabaseModule, LoggerModule, LoggerService } from '@/core';
import { RepositoriesModule } from '@/repositories';
import {
    Data,
    DataModule,
    DataService,
    defaultDataConfig,
} from '@/common/data';
import { ServicesModule, DungeonActionService } from '@/services';
import { DungeonCharacterActionController } from './dungeon-character-action.controller';

describe('DungeonCharacterActionController', () => {
    let controller: DungeonCharacterActionController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ ignoreEnvFile: false }),
                LoggerModule,
                DatabaseModule,
                RepositoriesModule,
                ServicesModule,
                DataModule,
            ],
            controllers: [DungeonCharacterActionController],
            providers: [LoggerService, DataService, DungeonActionService],
        }).compile();

        controller = module.get<DungeonCharacterActionController>(
            DungeonCharacterActionController,
        );
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
