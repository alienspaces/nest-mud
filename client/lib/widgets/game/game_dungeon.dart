import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

// Application packages
import 'package:client/logger.dart';
import 'package:client/cubit/dungeon/dungeon_cubit.dart';

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

    return BlocConsumer<DungeonCubit, DungeonState>(
      listener: (BuildContext context, DungeonState state) {
        log.info('listener...');
      },
      builder: (BuildContext context, DungeonState state) {
        if (state is DungeonStateLoaded) {
          return Container(
            child: Column(
              children: <Widget>[
                Text('Dungeon'),
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
