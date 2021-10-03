import 'package:client/repository/dungeon_action/dungeon_action_repository.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

// Application packages
import 'package:client/logger.dart';
import 'package:client/cubit/dungeon/dungeon_cubit.dart';
import 'package:client/cubit/dungeon_action/dungeon_action_cubit.dart';
import 'package:client/cubit/character/character_cubit.dart';

// TODO: Generates a 5 x 5 grid with buttons for directions, objects
// characters and monsters
class GameDungeonGridWidget extends StatefulWidget {
  const GameDungeonGridWidget({Key? key}) : super(key: key);

  @override
  _GameDungeonGridWidgetState createState() => _GameDungeonGridWidgetState();
}

typedef Widget DungeonGridMemberFunction(DungeonActionRecord record, String key);

class _GameDungeonGridWidgetState extends State<GameDungeonGridWidget> {
  double gridMemberWidth = 50;
  double gridMemberHeight = 50;

  Map<String, String> directionLabelMap = {
    'north': 'N',
    'northeast': 'NE',
    'east': 'E',
    'southeast': 'SE',
    'south': 'S',
    'southwest': 'SW',
    'west': 'W',
    'northwest': 'NW',
    'up': 'U',
    'down': 'D',
  };

  // Move widget
  Widget moveDirectionWidget(BuildContext context, DungeonActionRecord record, String direction) {
    if (record.location.directions.contains(direction)) {
      return Container(
        margin: EdgeInsets.all(2),
        child: ElevatedButton(
          onPressed: () {
            final log = getLogger('GameDungeonGridWidget');

            final dungeonCubit = BlocProvider.of<DungeonCubit>(context);
            if (dungeonCubit.dungeonRecord == null) {
              log.warning(
                'onPressed - Dungeon cubit missing dungeon record, cannot initialise action',
              );
              return;
            }
            _submitAction(context, 'move ${direction}');
          },
          child: Text('${directionLabelMap[direction]}'),
        ),
      );
    }
    return emptyWidget('${directionLabelMap[direction]}');
  }

  // Empty widget
  Widget emptyWidget(String label) {
    return Container(
      width: gridMemberWidth,
      height: gridMemberHeight,
      alignment: Alignment.center,
      margin: EdgeInsets.all(2),
      decoration: BoxDecoration(
        color: Color(0xFFD4D4D4),
        border: Border.all(
          color: Color(0xFFD4D4D4),
        ),
        borderRadius: BorderRadius.all(Radius.circular(5)),
      ),
      child: Text(label),
    );
  }

  List<Widget> generateGrid(BuildContext context) {
    final log = getLogger('CharacterCreateWidget');

    final dungeonActionCubit = BlocProvider.of<DungeonActionCubit>(context);
    if (dungeonActionCubit.dungeonActionRecord == null) {
      log.warning('Dungeon cubit dungeon record is null, cannot create character');
      return [];
    }

    List<Widget Function()> dunegonGridMemberFunctions = [
      // Top Row
      () => moveDirectionWidget(context, dungeonActionCubit.dungeonActionRecord!, 'northwest'),
      () => Container(),
      () => moveDirectionWidget(context, dungeonActionCubit.dungeonActionRecord!, 'north'),
      () => Container(),
      () => moveDirectionWidget(context, dungeonActionCubit.dungeonActionRecord!, 'northeast'),
      // Second Row
      () => Container(),
      () => Container(),
      () => moveDirectionWidget(context, dungeonActionCubit.dungeonActionRecord!, 'up'),
      () => Container(),
      () => Container(),
      // Third Row
      () => moveDirectionWidget(context, dungeonActionCubit.dungeonActionRecord!, 'west'),
      () => Container(),
      () => Container(),
      () => Container(),
      () => moveDirectionWidget(context, dungeonActionCubit.dungeonActionRecord!, 'east'),
      // Fourth Row
      () => Container(),
      () => Container(),
      () => moveDirectionWidget(context, dungeonActionCubit.dungeonActionRecord!, 'down'),
      () => Container(),
      () => Container(),
      // Bottom Row
      () => moveDirectionWidget(context, dungeonActionCubit.dungeonActionRecord!, 'southwest'),
      () => Container(),
      () => moveDirectionWidget(context, dungeonActionCubit.dungeonActionRecord!, 'south'),
      () => Container(),
      () => moveDirectionWidget(context, dungeonActionCubit.dungeonActionRecord!, 'southeast'),
    ];

    List<Widget> gridWidgets = [];
    dunegonGridMemberFunctions.forEach((gridMemberFunction) {
      gridWidgets.add(gridMemberFunction());
    });

    return gridWidgets;
  }

  void _submitAction(BuildContext context, String action) {
    final log = getLogger('GameDungeonGridWidget');
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

  @override
  Widget build(BuildContext context) {
    final log = getLogger('GameDungeonGridWidget');
    log.info('Building..');

    return BlocConsumer<DungeonActionCubit, DungeonActionState>(
      listener: (BuildContext context, DungeonActionState state) {
        log.info('listener...');
      },
      builder: (BuildContext context, DungeonActionState state) {
        if (state is DungeonActionStateCreated) {
          return Container(
            decoration: BoxDecoration(
              color: Color(0xFFDEDEDE),
              border: Border.all(
                color: Color(0xFFDEDEDE),
              ),
              borderRadius: BorderRadius.all(Radius.circular(5)),
            ),
            padding: EdgeInsets.all(1),
            margin: EdgeInsets.all(5),
            width: gridMemberWidth * 5,
            height: gridMemberHeight * 5,
            child: GridView.count(
              crossAxisCount: 5,
              children: generateGrid(context),
            ),
          );
        }

        // Empty
        return Container();
      },
    );
  }
}
