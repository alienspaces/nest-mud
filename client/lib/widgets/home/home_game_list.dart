import 'package:client/widgets/home/home_game.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

// Application packages
import 'package:client/logger.dart';
import 'package:client/cubit/dungeon/dungeon_cubit.dart';

class HomeGameListWidget extends StatefulWidget {
  const HomeGameListWidget({Key? key}) : super(key: key);

  @override
  _HomeGameListWidgetState createState() => _HomeGameListWidgetState();
}

class _HomeGameListWidgetState extends State<HomeGameListWidget> {
  void _loadDungeons(BuildContext context) {
    final dungeonCubit = BlocProvider.of<DungeonCubit>(context);
    dungeonCubit.loadDungeons();
  }

  @override
  void initState() {
    final log = getLogger('HomeGameListWidget');
    log.info('Initialising state..');

    super.initState();

    // Load available dungeons
    _loadDungeons(context);
  }

  @override
  Widget build(BuildContext context) {
    final log = getLogger('HomeGameListWidget');
    log.info('Building..');

    return BlocConsumer<DungeonCubit, DungeonState>(
      listener: (context, state) {
        log.info('listener...');
      },
      builder: (BuildContext context, DungeonState state) {
        log.info('builder...');
        List<Widget> widgets = [];
        if (state is DungeonStateUpdated) {
          state.dungeonRecords?.forEach((dungeonRecord) {
            widgets.add(HomeGameWidget(dungeonRecord: dungeonRecord));
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
