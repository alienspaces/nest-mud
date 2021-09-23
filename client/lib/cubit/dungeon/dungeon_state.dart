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
class DungeonStateLoading extends DungeonState {
  const DungeonStateLoading();

  @override
  List<Object> get props => [];
}

@immutable
class DungeonStateSelected extends DungeonState {
  final List<DungeonRecord>? dungeonRecords;
  final DungeonRecord? currentDungeonRecord;

  const DungeonStateSelected({required this.dungeonRecords, this.currentDungeonRecord});

  @override
  List<Object?> get props => [dungeonRecords, currentDungeonRecord];
}
