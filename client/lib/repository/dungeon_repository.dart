import 'dungeon_record.dart';

abstract class DungeonRepository {
  DungeonRecord create(DungeonRecord record);
}

class LocalDungeonRepository implements DungeonRepository {
  @override
  DungeonRecord create(DungeonRecord record) {
    return record;
  }
}
