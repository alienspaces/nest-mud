import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

// Application
import 'package:client/logger.dart';
import 'package:client/cubit/dungeon/dungeon_cubit.dart';
import 'package:client/repository/dungeon/dungeon_repository.dart';

class HomeGameWidget extends StatelessWidget {
  final DungeonRecord dungeonRecord;
  const HomeGameWidget({Key? key, required this.dungeonRecord}) : super(key: key);

  void selectCurrentDungeon(BuildContext context, DungeonRecord dungeonRecord) {
    final log = getLogger('HomeGameWidget');
    log.info('Select current dungeon ${dungeonRecord.id} ${dungeonRecord.name}');

    final dungeonCubit = BlocProvider.of<DungeonCubit>(context);
    dungeonCubit.selectDungeon(dungeonRecord);
  }

  @override
  Widget build(BuildContext context) {
    // TODO: Change to a BlocConsumer and display a nice looking dungeon container
    // with a button to choose the dungeon which display a create character form
    return Container(child: Text('${dungeonRecord.id} ${dungeonRecord.name}'));
  }
}
