import 'package:client/api/api.dart';

// Application
import 'package:client/repository/character/character_repository.dart';
import 'package:client/repository/dungeon/dungeon_repository.dart';
import 'package:client/repository/dungeon_action/dungeon_action_repository.dart';

class RepositoryCollection {
  final Map<String, String> config;
  final API api;
  late final CharacterRepository characterRepository;
  late final DungeonRepository dungeonRepository;
  late final DungeonActionRepository dungeonActionRepository;

  RepositoryCollection({required this.config, required this.api}) {
    this.characterRepository = CharacterRepository(config: this.config, api: this.api);
    this.dungeonRepository = DungeonRepository(config: this.config, api: this.api);
    this.dungeonActionRepository = DungeonActionRepository(config: this.config, api: this.api);
  }
}
