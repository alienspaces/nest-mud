import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

// Application packages
import 'package:client/logger.dart';
import 'package:client/theme.dart';
import 'package:client/navigation.dart';
import 'package:client/cubit/dungeon/dungeon_cubit.dart';
import 'package:client/cubit/character/character_cubit.dart';

void main() {
  // Initialise logger
  initLogger();

  // Run application
  runApp(MainApp());
}

class MainApp extends StatelessWidget {
  final log = getLogger('MainApp');

  @override
  Widget build(BuildContext context) {
    log.info('Building..');
    return MaterialApp(
      title: 'Nest MUD Client',
      theme: getTheme(context),
      home: MultiBlocProvider(
        providers: [
          BlocProvider<DungeonCubit>(
            create: (BuildContext context) => DungeonCubit(),
          ),
          BlocProvider<CharacterCubit>(
            create: (BuildContext context) => CharacterCubit(),
          ),
        ],
        child: Navigation(),
      ),
    );
  }
}
