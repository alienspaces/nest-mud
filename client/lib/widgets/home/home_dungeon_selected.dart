import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

// Application
import 'package:client/logger.dart';
import 'package:client/cubit/dungeon/dungeon_cubit.dart';
import 'package:client/repository/dungeon/dungeon_repository.dart';

class HomeDungeonSelectedWidget extends StatelessWidget {
  final DungeonRecord dungeonRecord;
  const HomeDungeonSelectedWidget({Key? key, required this.dungeonRecord}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final log = getLogger('HomeDungeonSelectedWidget');
    log.info('Building..');

    return BlocConsumer<DungeonCubit, DungeonState>(
      listener: (BuildContext context, DungeonState state) {
        //
      },
      builder: (BuildContext context, DungeonState state) {
        if (state is DungeonStateUpdated && state.currentDungeonRecord != null) {
          //
          return Container(
            child: Column(
              children: [
                Text('Create Character'),
                Text('${dungeonRecord.id} ${dungeonRecord.name}'),
              ],
            ),
          );
        }

        // Shouldn't get here..
        return Container();
      },
    );
  }
}
