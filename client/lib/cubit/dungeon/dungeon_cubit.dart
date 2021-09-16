import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';
import 'package:equatable/equatable.dart';

// Application
import 'package:client/logger.dart';
import 'package:client/repository/repository.dart';

part 'dungeon_state.dart';

class DungeonCubit extends Cubit<DungeonState> {
  DungeonCubit() : super(DungeonInitialState()) {}

  Future<void> loadDungeons() async {
    final log = getLogger('DungeonCubit');
    log.info('Loading dungeons...');
    emit(DungeonLoadingState());

    // TODO: Dungeon repository integration

    emit(DungeonReadyState(dungeonRecords: []));
  }
}
