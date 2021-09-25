import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

// Application packages
import 'package:client/logger.dart';
import 'package:client/cubit/dungeon/dungeon_cubit.dart';
import 'package:client/cubit/dungeon_action/dungeon_action_cubit.dart';
import 'package:client/cubit/character/character_cubit.dart';

class GameDungeonLocationDirectionsWidget extends StatefulWidget {
  const GameDungeonLocationDirectionsWidget({Key? key}) : super(key: key);

  @override
  _GameDungeonLocationDirectionsWidgetState createState() =>
      _GameDungeonLocationDirectionsWidgetState();
}

class _GameDungeonLocationDirectionsWidgetState extends State<GameDungeonLocationDirectionsWidget> {
  void _submitAction(BuildContext context, String action) {
    final log = getLogger('GameDungeonLocationDirectionsWidget');
    log.info('Submitting move action..');

    final dungeonCubit = BlocProvider.of<DungeonCubit>(context);
    if (dungeonCubit.dungeonRecord == null) {
      log.warning('Dungeon cubit missing dungeon record, cannot initialise action');
      return;
    }

    final characterCubit = BlocProvider.of<CharacterCubit>(context);
    if (characterCubit.characterRecord == null) {
      log.warning('Character cubit missing character record, cannot initialise action');
      return;
    }

    final dungeonActionCubit = BlocProvider.of<DungeonActionCubit>(context);
    dungeonActionCubit.createAction(
      dungeonCubit.dungeonRecord!.id,
      characterCubit.characterRecord!.id,
      action,
    );
  }

  List<Widget> _buildDirectionButtons(BuildContext context, DungeonActionStateCreated state) {
    List<Widget> directions = [];
    if (state.dungeonActionRecord == null) {
      return directions;
    }
    final locationDirections = state.dungeonActionRecord!.location.directions;
    locationDirections.forEach((locationDirection) {
      //
      directions.add(
        ElevatedButton(
          onPressed: () {
            final log = getLogger('GameDungeonLocationDirectionsWidget');

            final dungeonCubit = BlocProvider.of<DungeonCubit>(context);
            if (dungeonCubit.dungeonRecord == null) {
              log.warning(
                'onPressed - Dungeon cubit missing dungeon record, cannot initialise action',
              );
              return;
            }
            _submitAction(context, 'move ${locationDirection}');
          },
          child: Text('Move ${locationDirection}'),
        ),
      );
    });

    return directions;
  }

  @override
  Widget build(BuildContext context) {
    final log = getLogger('GameDungeonLocationDirectionsWidget');
    log.info('Building..');

    return BlocConsumer<DungeonActionCubit, DungeonActionState>(
      listener: (BuildContext context, DungeonActionState state) {
        log.info('listener...');
      },
      builder: (BuildContext context, DungeonActionState state) {
        if (state is DungeonActionStateCreated) {
          return Container(
            child: Column(
              children: _buildDirectionButtons(context, state),
            ),
          );
        }

        // Empty
        return Container();
      },
    );
  }
}
