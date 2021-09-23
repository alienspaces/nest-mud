import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';
import 'package:equatable/equatable.dart';

// Application
import 'package:client/logger.dart';
import 'package:client/repository/repository.dart';

part 'dungeon_state.dart';

class DungeonCubit extends Cubit<DungeonState> {
  final dungeonRepository = DungeonRepository();
  List<DungeonRecord>? dungeonRecords;
  DungeonRecord? dungeonRecord;

  DungeonCubit() : super(DungeonStateInitial()) {}

  void clearDungeon() {
    this.dungeonRecord = null;
    emit(DungeonStateLoaded(dungeonRecords: dungeonRecords));
  }

  Future<void> loadDungeons() async {
    final log = getLogger('DungeonCubit');
    log.info('Loading dungeons...');
    emit(DungeonStateLoading());

    dungeonRecords = await dungeonRepository.getMany();

    emit(DungeonStateLoaded(dungeonRecords: dungeonRecords));
  }

  Future<void> selectDungeon(DungeonRecord dungeonRecord) async {
    this.dungeonRecord = dungeonRecord;

    emit(
      DungeonStateLoaded(
        dungeonRecords: dungeonRecords,
        currentDungeonRecord: dungeonRecord,
      ),
    );
  }
}
