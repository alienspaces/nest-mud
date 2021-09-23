import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

// Application packages
import 'package:client/logger.dart';
import 'package:client/cubit/character/character_cubit.dart';

class GameCharacterWidget extends StatefulWidget {
  const GameCharacterWidget({Key? key}) : super(key: key);

  @override
  _GameCharacterWidgetState createState() => _GameCharacterWidgetState();
}

class _GameCharacterWidgetState extends State<GameCharacterWidget> {
  @override
  Widget build(BuildContext context) {
    final log = getLogger('GameCharacterWidget');
    log.info('Building..');

    return BlocConsumer<CharacterCubit, CharacterState>(
      listener: (BuildContext context, CharacterState state) {
        log.info('listener...');
      },
      builder: (BuildContext context, CharacterState state) {
        if (state is CharacterStateSelected) {
          return Container(
            child: Column(
              children: <Widget>[
                Text('Character'),
                Text('Name: ${state.characterRecord.name}'),
                Text('Strength: ${state.characterRecord.strength}'),
                Text('Dexterity: ${state.characterRecord.dexterity}'),
                Text('Intelligence: ${state.characterRecord.intelligence}'),
                Text('Fatigue: ${state.characterRecord.fatigue}'),
                Text('Health: ${state.characterRecord.health}'),
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
