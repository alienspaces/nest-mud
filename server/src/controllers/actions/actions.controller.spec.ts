import { Test, TestingModule } from '@nestjs/testing';
import { ActionsController } from './actions.controller';

// Application
import { ActionService } from '@/services/action/action.service';

describe('ActionsController', () => {
    let controller: ActionsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ActionsController],
            providers: [ActionService],
        }).compile();

        controller = module.get<ActionsController>(ActionsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
