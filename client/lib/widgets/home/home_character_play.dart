import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

// Application
import 'package:client/logger.dart';
import 'package:client/cubit/character/character_cubit.dart';
import 'package:client/repository/repository.dart';

const int MAX_ATTRIBUTES = 36;

class HomeCharacterPlayWidget extends StatefulWidget {
  final DungeonRecord dungeonRecord;
  const HomeCharacterPlayWidget({Key? key, required this.dungeonRecord}) : super(key: key);

  @override
  _HomeCharacterPlayWidgetState createState() => _HomeCharacterPlayWidgetState();
}

class _HomeCharacterPlayWidgetState extends State<HomeCharacterPlayWidget> {
  @override
  Widget build(BuildContext context) {
    final log = getLogger('HomeCharacterPlayWidget');
    log.info('Building..');

    return BlocConsumer<CharacterCubit, CharacterState>(
      listener: (BuildContext context, CharacterState state) {
        log.info('listener...');
      },
      builder: (BuildContext context, CharacterState state) {
        if (state is CharacterStateSelected) {
          return Container(
            margin: EdgeInsets.fromLTRB(20, 10, 20, 10),
            child: Text('Playing character ${state.characterRecord.name}'),
          );
        }

        // Shouldn't get here..
        return Container();
      },
    );
  }
}
