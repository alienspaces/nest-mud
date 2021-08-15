import { Module } from '@nestjs/common';

// Application
import { LoggerModule } from '@/core';
import { CharacterService } from './character/character.service';
import { DungeonService } from './dungeon/dungeon.service';
import { DungeonLocationService } from './dungeon/dungeon_location.service';
import { RepositoriesModule } from '@/repositories';

@Module({
    imports: [LoggerModule, RepositoriesModule],
    exports: [CharacterService, DungeonService, DungeonLocationService],
    providers: [CharacterService, DungeonService, DungeonLocationService],
})
export class ServicesModule {}
