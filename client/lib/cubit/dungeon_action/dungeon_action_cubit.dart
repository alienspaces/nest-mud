import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';
import 'package:equatable/equatable.dart';

// Application
import 'package:client/logger.dart';
import 'package:client/repository/repository.dart';

part 'dungeon_action_state.dart';

class DungeonActionCubit extends Cubit<DungeonActionState> {
  final dungeonActionRepository = DungeonActionRepository();
  List<DungeonActionRecord>? dungeonRecords;
  DungeonActionRecord? dungeonRecord;

  DungeonActionCubit() : super(DungeonActionStateInitial()) {}

  Future<void> createAction(String dungeonID, String characterID, String sentence) async {
    final log = getLogger('DungeonActionCubit');
    log.info('Creating dungeon action ${sentence}');

    emit(DungeonActionStateCreating());

    DungeonActionRecord? createdDungeonActionRecord =
        await dungeonActionRepository.create(dungeonID, characterID, sentence);

    log.info('Created character ${createdDungeonActionRecord}');

    if (createdDungeonActionRecord != null) {
      emit(DungeonActionStateCreated(dungeonActionRecord: createdDungeonActionRecord));
    }
  }
}
