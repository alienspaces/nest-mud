import 'package:client/widgets/home/home_dungeon.dart';
import 'package:client/widgets/home/home_character_create.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

// Application packages
import 'package:client/logger.dart';
import 'package:client/cubit/dungeon/dungeon_cubit.dart';

class HomeDungeonListWidget extends StatefulWidget {
  const HomeDungeonListWidget({Key? key}) : super(key: key);

  @override
  _HomeDungeonListWidgetState createState() => _HomeDungeonListWidgetState();
}

class _HomeDungeonListWidgetState extends State<HomeDungeonListWidget> {
  @override
  void initState() {
    final log = getLogger('HomeDungeonListWidget');
    log.info('Initialising state..');

    super.initState();

    _loadDungeons(context);
  }

  /// Loads available dungeons
  void _loadDungeons(BuildContext context) {
    final log = getLogger('HomeDungeonListWidget');
    log.info('Loading dungeons');

    final dungeonCubit = BlocProvider.of<DungeonCubit>(context);
    dungeonCubit.loadDungeons();
  }

  @override
  Widget build(BuildContext context) {
    final log = getLogger('HomeDungeonListWidget');
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
            // Dungeon selected
            if (state is DungeonStateUpdated &&
                state.currentDungeonRecord?.id == dungeonRecord.id) {
              widgets.add(
                Container(
                  child: HomeCharacterCreateWidget(dungeonRecord: dungeonRecord),
                ),
              );
              return;
            }

            // Dungeon not selected
            widgets.add(
              Container(
                child: HomeDungeonWidget(dungeonRecord: dungeonRecord),
              ),
            );
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
