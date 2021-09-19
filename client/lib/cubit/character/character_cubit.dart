import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';
import 'package:equatable/equatable.dart';

// Application
import 'package:client/repository/repository.dart';
import 'package:client/logger.dart';

part 'character_state.dart';

class CharacterCubit extends Cubit<CharacterState> {
  final characterRepository = CharacterRepository();

  CharacterCubit() : super(CharacterInitial()) {}

  Future<void> createCharacter(CharacterRecord characterRecord) async {
    final log = getLogger('CharacterCubit');
    log.info('Creating character ${characterRecord}');

    emit(CharacterStateCreating());

    characterRecord = await characterRepository.create(characterRecord);

    emit(CharacterStateUpdated(characterRecord: characterRecord));
  }
}
