import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

// Application
import 'package:client/logger.dart';
import 'package:client/navigation.dart';
import 'package:client/cubit/character/character_cubit.dart';

const int MAX_ATTRIBUTES = 36;

class CharacterPlayWidget extends StatefulWidget {
  final NavigationCallbacks callbacks;

  const CharacterPlayWidget({
    Key? key,
    required this.callbacks,
  }) : super(key: key);

  @override
  _CharacterPlayWidgetState createState() => _CharacterPlayWidgetState();
}

class _CharacterPlayWidgetState extends State<CharacterPlayWidget> {
  Widget _buildAttribute(String name, int? value) {
    return Row(
      children: <Widget>[
        Container(
          child: Text(name),
        ),
        Container(
          width: 100,
          child: Text('${value}'),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final log = getLogger('CharacterPlayWidget');
    log.info('Building..');

    return BlocConsumer<CharacterCubit, CharacterState>(
      listener: (BuildContext context, CharacterState state) {
        log.info('listener...');
      },
      builder: (BuildContext context, CharacterState state) {
        if (state is CharacterStateSelected) {
          return Container(
            margin: EdgeInsets.fromLTRB(20, 10, 20, 10),
            child: Column(
              children: <Widget>[
                Container(
                  child: Text('Playing character ${state.characterRecord.name}'),
                ),
                Container(
                  child: _buildAttribute('Strength', state.characterRecord.strength),
                ),
                Container(
                  child: _buildAttribute('Dexterity', state.characterRecord.dexterity),
                ),
                Container(
                  child: _buildAttribute('Intelligence', state.characterRecord.intelligence),
                ),
                Container(
                  child: _buildAttribute('Fatigue', state.characterRecord.fatigue),
                ),
                Container(
                  child: _buildAttribute('Health', state.characterRecord.health),
                ),
                Container(
                  child: ElevatedButton(
                    onPressed: widget.callbacks.openGamePage,
                    child: Text(
                      'Play',
                    ),
                  ),
                ),
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
