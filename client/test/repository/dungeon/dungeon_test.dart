import 'package:flutter_test/flutter_test.dart';

// Application
import 'package:client/repository/dungeon/dungeon_repository.dart';

void main() {
  test('DungeonRepository should ', () async {
    final repository = DungeonRepository();
    expect(repository, isNotNull);
    final dungeons = await repository.getMany();
    expect(dungeons, isNotEmpty);
  });
}
