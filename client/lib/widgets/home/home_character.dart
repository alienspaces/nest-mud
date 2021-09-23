import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

// Application packages
import 'package:client/logger.dart';
import 'package:client/navigation.dart';
import 'package:client/repository/repository.dart';
import 'package:client/cubit/character/character_cubit.dart';
import 'package:client/widgets/home/home_character_create.dart';
import 'package:client/widgets/home/home_character_play.dart';

class HomeCharacterWidget extends StatefulWidget {
  final NavigationCallbacks callbacks;

  final DungeonRecord dungeonRecord;

  const HomeCharacterWidget({Key? key, required this.callbacks, required this.dungeonRecord})
      : super(key: key);

  @override
  _HomeCharacterWidgetState createState() => _HomeCharacterWidgetState();
}

class _HomeCharacterWidgetState extends State<HomeCharacterWidget> {
  @override
  Widget build(BuildContext context) {
    final log = getLogger('HomeCharacter');
    log.info('Building..');

    return BlocConsumer<CharacterCubit, CharacterState>(
      listener: (BuildContext context, CharacterState state) {
        log.info('listener...');
      },
      builder: (BuildContext context, CharacterState characterState) {
        if (characterState is CharacterStateInitial) {
          return Container(
            child: HomeCharacterCreateWidget(
              dungeonRecord: widget.dungeonRecord,
            ),
          );
        } else if (characterState is CharacterStateSelected) {
          return Container(
            child: HomeCharacterPlayWidget(
              callbacks: widget.callbacks,
              dungeonRecord: widget.dungeonRecord,
            ),
          );
        }

        // Shouldn't get here..
        return Container();
      },
    );
  }
}
