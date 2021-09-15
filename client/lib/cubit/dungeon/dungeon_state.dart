part of 'dungeon_cubit.dart';

@immutable
abstract class DungeonState extends Equatable {
  const DungeonState();
}

@immutable
class DungeonInitial extends DungeonState {
  const DungeonInitial();

  @override
  List<Object> get props => [];
}
