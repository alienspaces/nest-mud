import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

// Application packages
import 'package:client/logger.dart';
import 'package:client/navigation.dart';
import 'package:client/cubit/character/character_cubit.dart';
import 'package:client/widgets/character/character_create.dart';
import 'package:client/widgets/character/character_play.dart';

class CharacterContainerWidget extends StatefulWidget {
  final NavigationCallbacks callbacks;

  const CharacterContainerWidget({
    Key? key,
    required this.callbacks,
  }) : super(key: key);

  @override
  _CharacterContainerWidgetState createState() => _CharacterContainerWidgetState();
}

class _CharacterContainerWidgetState extends State<CharacterContainerWidget> {
  @override
  Widget build(BuildContext context) {
    final log = getLogger('CharacterContainer');
    log.info('Building..');

    return BlocConsumer<CharacterCubit, CharacterState>(
      listener: (BuildContext context, CharacterState state) {
        log.info('listener...');
      },
      builder: (BuildContext context, CharacterState characterState) {
        if (characterState is CharacterStateInitial ||
            characterState is CharacterStateCreateError) {
          return Container(
            child: CharacterCreateWidget(
              callbacks: widget.callbacks,
            ),
          );
        } else if (characterState is CharacterStateSelected) {
          return Container(
            child: CharacterPlayWidget(
              callbacks: widget.callbacks,
            ),
          );
        }

        // Shouldn't get here..
        return Container();
      },
    );
  }
}
