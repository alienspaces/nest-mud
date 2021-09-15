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
