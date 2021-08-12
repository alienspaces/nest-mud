import { Module } from '@nestjs/common';

// Application
import { DatabaseModule, LoggerModule } from '@/core';
import { CharacterRepository } from './character/character.repository';
import { LocationRepository } from './location/location.repository';

@Module({
    imports: [LoggerModule, DatabaseModule],
    exports: [CharacterRepository, LocationRepository],
    providers: [CharacterRepository, LocationRepository],
})
export class RepositoriesModule {}
