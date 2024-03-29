import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

// Application
import 'package:client/logger.dart';
import 'package:client/navigation.dart';
import 'package:client/cubit/dungeon/dungeon_cubit.dart';
import 'package:client/repository/dungeon/dungeon_repository.dart';

class HomeDungeonWidget extends StatelessWidget {
  final NavigationCallbacks callbacks;
  final DungeonRecord dungeonRecord;
  const HomeDungeonWidget({Key? key, required this.callbacks, required this.dungeonRecord})
      : super(key: key);

  /// Sets the current dungeon state to the provided dungeon
  void _selectDungeon(BuildContext context, DungeonRecord dungeonRecord) {
    final log = getLogger('HomeGameWidget');
    log.info('Select current dungeon ${dungeonRecord.id} ${dungeonRecord.name}');

    final dungeonCubit = BlocProvider.of<DungeonCubit>(context);
    dungeonCubit.selectDungeon(dungeonRecord);

    this.callbacks.openCharacterPage();
  }

  @override
  Widget build(BuildContext context) {
    final log = getLogger('HomeDungeonWidget');
    log.info('Select current dungeon ${dungeonRecord.id} ${dungeonRecord.name}');

    // TODO: Centralise styles..
    ButtonStyle buttonStyle = ElevatedButton.styleFrom(
      padding: EdgeInsets.fromLTRB(30, 15, 30, 15),
      textStyle: Theme.of(context).textTheme.button!.copyWith(fontSize: 18),
    );

    return BlocConsumer<DungeonCubit, DungeonState>(
      listener: (BuildContext context, DungeonState state) {
        //
      },
      builder: (BuildContext context, DungeonState state) {
        return Container(
          child: Column(
            children: [
              Container(
                margin: EdgeInsets.fromLTRB(0, 10, 0, 10),
                child: Text('${dungeonRecord.name}', style: Theme.of(context).textTheme.headline3),
              ),
              Container(
                margin: EdgeInsets.fromLTRB(0, 10, 0, 10),
                child: Text('${dungeonRecord.description}'),
              ),
              Container(
                margin: EdgeInsets.fromLTRB(0, 10, 0, 10),
                child: ElevatedButton(
                  onPressed: () => _selectDungeon(context, dungeonRecord),
                  style: buttonStyle,
                  child: Text('Play'),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
