import { Controller } from '@nestjs/common';

// Application
import { ActionsService } from '@/services/actions/actions.service';

@Controller('/api/v1/actions')
export class ActionsController {
    constructor(private actionsService: ActionsService){}
}
