import { Test, TestingModule } from '@nestjs/testing';
import { DungeonCharacterActionController } from './dungeon-character-action.controller';

// Application
import { ActionService } from '@/services/action/action.service';

describe('DungeonCharacterActionController', () => {
    let controller: DungeonCharacterActionController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DungeonCharacterActionController],
            providers: [ActionService],
        }).compile();

        controller = module.get<DungeonCharacterActionController>(
            DungeonCharacterActionController,
        );
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
