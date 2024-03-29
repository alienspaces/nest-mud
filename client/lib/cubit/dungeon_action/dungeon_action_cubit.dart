import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';
import 'package:equatable/equatable.dart';

// Application
import 'package:client/logger.dart';
import 'package:client/repository/repository.dart';

part 'dungeon_action_state.dart';

class DungeonActionCubit extends Cubit<DungeonActionState> {
  final Map<String, String> config;
  final RepositoryCollection repositories;

  List<DungeonActionRecord>? dungeonActionRecords;
  DungeonActionRecord? dungeonActionRecord;

  DungeonActionCubit({required this.config, required this.repositories})
      : super(DungeonActionStateInitial()) {}

  Future<void> createAction(String dungeonID, String characterID, String sentence) async {
    final log = getLogger('DungeonActionCubit');
    log.info('Creating dungeon action ${sentence}');

    emit(DungeonActionStateCreating());

    DungeonActionRecord? createdDungeonActionRecord =
        await repositories.dungeonActionRepository.create(dungeonID, characterID, sentence);

    log.info('Created dungeon action ${createdDungeonActionRecord}');

    if (createdDungeonActionRecord != null) {
      this.dungeonActionRecord = createdDungeonActionRecord;
      emit(DungeonActionStateCreated(dungeonActionRecord: createdDungeonActionRecord));
    }
  }
}
