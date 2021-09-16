import 'package:equatable/equatable.dart';

part 'character_record.dart';

abstract class CharacterRepository {
  CharacterRecord create(CharacterRecord record);
}

class LocalCharacterRepository implements CharacterRepository {
  @override
  CharacterRecord create(CharacterRecord record) {
    return record;
  }
}
