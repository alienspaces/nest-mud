import 'package:equatable/equatable.dart';

// Package
part 'character_record.dart';

abstract class CharacterRepositoryInterface {
  CharacterRecord create(CharacterRecord record);
}

class CharacterRepository implements CharacterRepositoryInterface {
  @override
  CharacterRecord create(CharacterRecord record) {
    return record;
  }
}
