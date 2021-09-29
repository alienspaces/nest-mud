import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

// Application packages
import 'package:client/api/api.dart';
import 'package:client/config.dart';
import 'package:client/logger.dart';
import 'package:client/repository/repository.dart';
import 'package:client/theme.dart';
import 'package:client/navigation.dart';
import 'package:client/cubit/dungeon/dungeon_cubit.dart';
import 'package:client/cubit/dungeon_action/dungeon_action_cubit.dart';
import 'package:client/cubit/character/character_cubit.dart';

void main() {
  // Initialise logger
  initLogger();

  // Dependencies

  // When hostname is localhost and we are running
  // in an emulator set backend to specific IP
  if (!kIsWeb && config['serverHost'].toString() == 'localhost') {
    config['serverHost'] = '10.0.3.2';
  }

  final API api = API(config: config);

  final repositories = RepositoryCollection(config: config, api: api);

  // Run application
  runApp(MainApp(config: config, repositories: repositories));
}

class MainApp extends StatelessWidget {
  final Map<String, String> config;
  final RepositoryCollection repositories;

  MainApp({required this.config, required this.repositories}) : super();

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
            create: (BuildContext context) =>
                DungeonCubit(config: this.config, repositories: repositories),
          ),
          BlocProvider<DungeonActionCubit>(
            create: (BuildContext context) =>
                DungeonActionCubit(config: this.config, repositories: repositories),
          ),
          BlocProvider<CharacterCubit>(
            create: (BuildContext context) =>
                CharacterCubit(config: config, repositories: repositories),
          ),
        ],
        child: Navigation(),
      ),
    );
  }
}
