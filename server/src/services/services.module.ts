import { Module } from '@nestjs/common';

// Application
import { LoggerModule } from '@/core';
import { CharacterService } from './character/character.service';
import { DungeonService } from './dungeon/dungeon.service';
import { RepositoriesModule } from '@/repositories';

@Module({
    imports: [LoggerModule, RepositoriesModule],
    exports: [CharacterService, DungeonService],
    providers: [CharacterService, DungeonService],
})
export class ServicesModule {}
