part of 'dungeon_cubit.dart';

@immutable
abstract class DungeonState extends Equatable {
  const DungeonState();
}

@immutable
class DungeonInitialState extends DungeonState {
  const DungeonInitialState();

  @override
  List<Object> get props => [];
}

@immutable
class DungeonLoadingState extends DungeonState {
  const DungeonLoadingState();

  @override
  List<Object> get props => [];
}

@immutable
class DungeonReadyState extends DungeonState {
  final List<DungeonRecord> dungeonRecords;

  const DungeonReadyState({required this.dungeonRecords});

  @override
  List<Object> get props => [dungeonRecords];
}
