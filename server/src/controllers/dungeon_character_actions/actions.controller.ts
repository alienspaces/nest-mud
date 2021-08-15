import { Controller } from '@nestjs/common';

// Application
import { ActionService } from '@/services/action/action.service';

@Controller('/api/v1/dungeons/:dungeon_id/characters/:character_id/actions')
export class ActionsController {
    constructor(private actionsService: ActionService) {}
}
