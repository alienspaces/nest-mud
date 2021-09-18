import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

// Application packages
import 'package:client/logger.dart';
import 'package:client/cubit/dungeon/dungeon_cubit.dart';

class GameListWidget extends StatefulWidget {
  const GameListWidget({Key? key}) : super(key: key);

  @override
  _GameListWidgetState createState() => _GameListWidgetState();
}

class _GameListWidgetState extends State<GameListWidget> {
  void _loadDungeons(BuildContext context) {
    final dungeonCubit = BlocProvider.of<DungeonCubit>(context);
    dungeonCubit.loadDungeons();
  }

  @override
  void initState() {
    final log = getLogger('GameListWidget');
    log.info('Initialising state..');

    super.initState();

    // Load available dungeons
    final dungeonCubit = BlocProvider.of<DungeonCubit>(context);
    dungeonCubit.loadDungeons();
  }

  @override
  Widget build(BuildContext context) {
    final log = getLogger('GameListWidget');
    log.info('Building..');

    return BlocConsumer<DungeonCubit, DungeonState>(
      listener: (context, state) {
        log.info('listener...');
        if (state is DungeonInitialState) {
          _loadDungeons(context);
        }
      },
      builder: (BuildContext context, DungeonState state) {
        log.info('builder...');
        List<Widget> widgets = [];
        if (state is DungeonReadyState) {
          state.dungeonRecords.forEach((dungeonRecord) {
            widgets.add(Text('${dungeonRecord?.name}'));
          });
        }
        return Container(
          child: Column(
            children: widgets,
          ),
        );
      },
    );
  }
}
