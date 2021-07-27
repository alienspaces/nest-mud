import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

// Application
import { DatabaseService } from '@/common/database/database.service';
import { Character } from '@/interfaces/character.interface';
import { CharacterRepository } from './character.repository';

describe('CharacterRepository', () => {
    let repository: CharacterRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ConfigService, DatabaseService, CharacterRepository],
        }).compile();

        // NOTE: Must await.resolve as we have request scoped dependencies
        repository = await module.resolve<CharacterRepository>(
            CharacterRepository,
        );
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });

    describe('buildInserSQL', () => {
        it('should return SQL', () => {
            const data: Character = {
                id: 'a',
                location_id: 'a',
                name: 'a',
                strength: 1,
                dexterity: 1,
                intelligence: 1,
                coin: 1,
                experience: 1,
            };
            const sql = repository.buildInsertSQL();
        });
    });
});
