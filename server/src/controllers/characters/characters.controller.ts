import { Controller } from '@nestjs/common';

// Application
import { CharacterService } from '@/services/character/character.service';

@Controller('/api/v1/characters')
export class CharactersController {
    constructor(private characterService: CharacterService) {}
}
