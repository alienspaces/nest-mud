import { Module } from '@nestjs/common';

// Application
import { CharacterService } from './character/character.service';
import { LocationService } from './location/location.service';
import { RepositoriesModule } from '@/repositories';

@Module({
    imports: [RepositoriesModule],
    exports: [CharacterService, LocationService],
    providers: [CharacterService, LocationService],
})
export class ServicesModule {}
