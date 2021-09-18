import 'package:flutter_test/flutter_test.dart';

// Application
import 'package:client/repository/character/character_repository.dart';

void main() {
  test('CharacterRepository should ', () async {
    final repository = CharacterRepository();
    expect(repository, isNotNull);
  });
}
