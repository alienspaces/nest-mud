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

  CharacterCubit() : super(CharacterStateInitial()) {}

  Future<void> createCharacter(String dungeonID, CharacterRecord characterRecord) async {
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

    CharacterRecord? updatedCharacterRecord =
        await characterRepository.create(dungeonID, characterRecord);

    log.info('Created character ${updatedCharacterRecord}');

    if (updatedCharacterRecord != null) {
      emit(CharacterStateUpdated(characterRecord: updatedCharacterRecord));
    }
  }
}
