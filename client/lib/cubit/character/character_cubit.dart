import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';
import 'package:equatable/equatable.dart';

// Application
import 'package:client/repository/repository.dart';
import 'package:client/logger.dart';

part 'character_state.dart';

const int MAX_ATTRIBUTES = 36;

class CharacterCubit extends Cubit<CharacterState> {
  final characterRepository = CharacterRepository();
  CharacterRecord? characterRecord;

  CharacterCubit() : super(CharacterStateInitial()) {}

  void clearCharacter() {
    this.characterRecord = null;
    emit(CharacterStateInitial());
  }

  Future<void> createCharacter(String dungeonID, CreateCharacterRecord characterRecord) async {
    final log = getLogger('CharacterCubit');
    log.info('Creating character ${characterRecord}');

    emit(CharacterStateCreating());

    if (characterRecord.strength + characterRecord.dexterity + characterRecord.intelligence >
        MAX_ATTRIBUTES) {
      String message = 'New character attributes exceeds maximum allowed';
      log.warning(message);
      emit(CharacterStateError(characterRecord: characterRecord, message: message));
      return;
    }

    CharacterRecord? createdCharacterRecord =
        await characterRepository.create(dungeonID, characterRecord);

    if (createdCharacterRecord != null) {
      log.info('Created character ${createdCharacterRecord}');
      this.characterRecord = createdCharacterRecord;
      emit(CharacterStateSelected(characterRecord: createdCharacterRecord));
    }
  }

  Future<void> loadCharacter(String dungeonID, String characterID) async {
    final log = getLogger('CharacterCubit');
    log.info('Creating character ID ${characterID}');

    emit(CharacterStateLoading());

    CharacterRecord? loadedCharacterRecord = await characterRepository.load(dungeonID, characterID);

    log.info('Created character ${loadedCharacterRecord}');

    if (loadedCharacterRecord != null) {
      emit(CharacterStateSelected(characterRecord: loadedCharacterRecord));
    }
  }
}
