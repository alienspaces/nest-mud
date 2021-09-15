import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';
import 'package:equatable/equatable.dart';

part 'dungeon_state.dart';

class DungeonCubit extends Cubit<DungeonState> {
  DungeonCubit() : super(DungeonInitial()) {}
}
