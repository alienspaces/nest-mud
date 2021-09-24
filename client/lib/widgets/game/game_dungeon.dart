import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

// Application packages
import 'package:client/logger.dart';
import 'package:client/cubit/dungeon_action/dungeon_action_cubit.dart';

class GameDungeonWidget extends StatefulWidget {
  const GameDungeonWidget({Key? key}) : super(key: key);

  @override
  _GameDungeonWidgetState createState() => _GameDungeonWidgetState();
}

class _GameDungeonWidgetState extends State<GameDungeonWidget> {
  @override
  Widget build(BuildContext context) {
    final log = getLogger('GameCharacterWidget');
    log.info('Building..');

    return BlocConsumer<DungeonActionCubit, DungeonActionState>(
      listener: (BuildContext context, DungeonActionState state) {
        log.info('listener...');
      },
      builder: (BuildContext context, DungeonActionState state) {
        if (state is DungeonActionStateCreated) {
          return Container(
            child: Column(
              children: <Widget>[
                Text('Dungeon'),
                Text('Command: ${state.dungeonActionRecord?.action.command}'),
                Text('Name: ${state.dungeonActionRecord?.location.name}'),
                Text('Description: ${state.dungeonActionRecord?.location.description}'),
              ],
            ),
          );
        }

        // Empty
        return Container();
      },
    );
  }
}
