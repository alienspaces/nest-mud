import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

// Application
import 'package:client/logger.dart';
import 'package:client/cubit/dungeon/dungeon_cubit.dart';
import 'package:client/repository/dungeon/dungeon_repository.dart';

class HomeDungeonWidget extends StatelessWidget {
  final DungeonRecord dungeonRecord;
  const HomeDungeonWidget({Key? key, required this.dungeonRecord}) : super(key: key);

  void selectDungeon(BuildContext context, DungeonRecord dungeonRecord) {
    final log = getLogger('HomeGameWidget');
    log.info('Select current dungeon ${dungeonRecord.id} ${dungeonRecord.name}');

    final dungeonCubit = BlocProvider.of<DungeonCubit>(context);
    dungeonCubit.selectDungeon(dungeonRecord);
  }

  @override
  Widget build(BuildContext context) {
    final log = getLogger('HomeDungeonWidget');
    log.info('Select current dungeon ${dungeonRecord.id} ${dungeonRecord.name}');

    return BlocConsumer<DungeonCubit, DungeonState>(
      listener: (BuildContext context, DungeonState state) {
        //
      },
      builder: (BuildContext context, DungeonState state) {
        return Container(
          child: Column(
            children: [
              Text('Enter Dungeon'),
              Text('${dungeonRecord.id} ${dungeonRecord.name}'),
              ElevatedButton(
                onPressed: () => selectDungeon(context, dungeonRecord),
                child: Text('Create Character'),
              ),
            ],
          ),
        );
      },
    );
  }
}
