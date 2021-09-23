import 'package:client/widgets/home/home_dungeon.dart';
import 'package:client/widgets/home/home_character.dart';
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

        if (state is DungeonStateLoaded) {
          state.dungeonRecords?.forEach((dungeonRecord) {
            log.info('Checking dungeon ID ${dungeonRecord.id}');
            // Dungeon selected
            if (state is DungeonStateLoaded && state.currentDungeonRecord?.id == dungeonRecord.id) {
              log.info('Displaying character widget');
              widgets.add(
                Container(
                  child: HomeCharacterWidget(dungeonRecord: dungeonRecord),
                ),
              );
              return;
            }

            // Dungeon not selected
            log.info('Displaying dungeon widget');
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
