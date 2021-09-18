import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

// Application packages
import 'package:client/logger.dart';
import 'package:client/cubit/dungeon/dungeon_cubit.dart';

class GameContainerWidget extends StatefulWidget {
  const GameContainerWidget({Key? key}) : super(key: key);

  @override
  _GameContainerWidgetState createState() => _GameContainerWidgetState();
}

class _GameContainerWidgetState extends State<GameContainerWidget> {
  @override
  Widget build(BuildContext context) {
    final log = getLogger('GameContainer');
    log.info('Building..');

    return BlocProvider(
      create: (context) => DungeonCubit(),
      child: Container(),
    );
  }
}
