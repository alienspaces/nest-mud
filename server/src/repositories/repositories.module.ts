import { Module } from '@nestjs/common';

// Application
import { DatabaseModule } from '@/core/database/database.module';
import { CharacterRepository } from './character/character.repository';
import { LocationRepository } from './location/location.repository';

@Module({
    imports: [DatabaseModule],
    exports: [CharacterRepository, LocationRepository],
    providers: [CharacterRepository, LocationRepository],
})
export class RepositoriesModule {}
