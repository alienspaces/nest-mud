part of 'character_cubit.dart';

@immutable
abstract class CharacterState extends Equatable {
  const CharacterState();
}

@immutable
class CharacterInitial extends CharacterState {
  const CharacterInitial();

  @override
  List<Object> get props => [];
}

@immutable
class CharacterStateCreating extends CharacterState {
  const CharacterStateCreating();

  @override
  List<Object> get props => [];
}

@immutable
class CharacterStateUpdated extends CharacterState {
  final CharacterRecord characterRecord;
  const CharacterStateUpdated({required this.characterRecord});

  @override
  List<Object> get props => [characterRecord];
}
