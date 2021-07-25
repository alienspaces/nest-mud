import { Controller } from '@nestjs/common';

// Application
import { CharactersService } from '@/services/characters/characters.service';

@Controller('/api/v1/characters')
export class CharactersController {
    constructor(private charactersService: CharactersService) {}
}
