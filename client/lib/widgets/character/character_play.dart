import 'package:client/widgets/common/character.dart';
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
            margin: EdgeInsets.fromLTRB(20, 2, 20, 2),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: <Widget>[
                CharacterWidget(),
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
