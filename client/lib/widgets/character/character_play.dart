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
    EdgeInsetsGeometry padding = EdgeInsets.fromLTRB(10, 10, 10, 10);

    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: <Widget>[
        Spacer(flex: 1),
        Flexible(
          flex: 2,
          child: Container(
            padding: padding,
            alignment: Alignment.centerLeft,
            child: Text(name),
          ),
        ),
        Spacer(flex: 1),
        Flexible(
          flex: 2,
          child: Container(
            padding: padding,
            alignment: Alignment.centerLeft,
            child: Text('${value}'),
          ),
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
              crossAxisAlignment: CrossAxisAlignment.center,
              children: <Widget>[
                Container(
                  child: Text(
                    '${state.characterRecord.name}',
                    style: Theme.of(context).textTheme.headline3,
                  ),
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
                  child: _buildAttribute('Health', state.characterRecord.health),
                ),
                Container(
                  child: _buildAttribute('Fatigue', state.characterRecord.fatigue),
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
