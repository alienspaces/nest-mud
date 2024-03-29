import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { validate as uuidValidate } from 'uuid';

// Application
import { DatabaseModule, DatabaseService, LoggerModule, LoggerService } from '@/core';
import { RepositoriesModule } from '@/repositories';
import { ServicesModule, DungeonCharacterService, DungeonService, DungeonLocationService } from '@/services';

import { Data, DataService } from './data.service';
import { defaultDataConfig } from './data.config';

describe('DataService', () => {
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ ignoreEnvFile: false }),
                LoggerModule,
                DatabaseModule,
                RepositoriesModule,
                ServicesModule,
            ],
            providers: [DataService],
        }).compile();
    });

    it('should be defined', async () => {
        const service = await module.resolve<DataService>(DataService);
        expect(service).toBeDefined();
    });

    it('should setup and teardown default data', async () => {
        const service = await module.resolve<DataService>(DataService);
        const data = new Data();
        await expect(service.setup(defaultDataConfig(), data)).resolves.not.toThrow();

        expect(data.dungeonEntities).toBeTruthy();
        expect(data.dungeonEntities.length).toEqual(1);
        data.dungeonEntities.forEach((dungeonEntity) => {
            expect(uuidValidate(dungeonEntity.id)).toBeTruthy();
        });

        expect(data.dungeonLocationEntities).toBeTruthy();
        expect(data.dungeonLocationEntities.length).toEqual(3);
        data.dungeonLocationEntities.forEach((dungeonLocationEntity) => {
            expect(uuidValidate(dungeonLocationEntity.id)).toBeTruthy();
            expect(uuidValidate(dungeonLocationEntity.dungeon_id)).toBeTruthy();
        });

        expect(data.dungeonCharacterEntities).toBeTruthy();
        expect(data.dungeonCharacterEntities.length).toEqual(1);
        data.dungeonCharacterEntities.forEach((dungeonCharacterEntity) => {
            expect(uuidValidate(dungeonCharacterEntity.id)).toBeTruthy();
            expect(uuidValidate(dungeonCharacterEntity.dungeon_id)).toBeTruthy();
        });

        expect(data.dungeonMonsterEntities).toBeTruthy();
        expect(data.dungeonMonsterEntities.length).toEqual(1);
        data.dungeonMonsterEntities.forEach((dungeonMonsterEntity) => {
            expect(uuidValidate(dungeonMonsterEntity.id)).toBeTruthy();
            expect(uuidValidate(dungeonMonsterEntity.dungeon_id)).toBeTruthy();
        });

        expect(data.dungeonObjectEntities).toBeTruthy();
        expect(data.dungeonObjectEntities.length).toEqual(1);
        data.dungeonObjectEntities.forEach((dungeonObjectEntity) => {
            expect(uuidValidate(dungeonObjectEntity.id)).toBeTruthy();
            expect(uuidValidate(dungeonObjectEntity.dungeon_id)).toBeTruthy();
        });

        await expect(service.teardown(data)).resolves.not.toThrow();
    });

    it('should run successfully in parallel', async () => {
        const testFunc = async () => {
            const service = await module.resolve<DataService>(DataService);
            const data = new Data();
            await expect(service.setup(defaultDataConfig(), data)).resolves.not.toThrow();
            await expect(service.teardown(data)).resolves.not.toThrow();
        };
        const testFuncs = [];
        for (let index = 0; index < 3; index++) {
            testFuncs.push(testFunc());
        }
        return Promise.all(testFuncs);
    });
});
