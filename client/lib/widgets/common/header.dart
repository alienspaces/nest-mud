import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

// Application
import 'package:client/navigation.dart';
import 'package:client/logger.dart';
import 'package:client/cubit/character/character_cubit.dart';
import 'package:client/cubit/dungeon/dungeon_cubit.dart';

void _navigateHome(BuildContext context, NavigationCallbacks callbacks) {
  final log = getLogger('Header');

  log.info('Clearing state');
  final characterCubit = BlocProvider.of<CharacterCubit>(context);
  characterCubit.clearCharacter();
  final dungeonCubit = BlocProvider.of<DungeonCubit>(context);
  dungeonCubit.clearDungeon();

  log.info('Navigating...');
  callbacks.openHomePage();
}

AppBar header(BuildContext context, NavigationCallbacks callbacks) {
  return AppBar(
    title: Text(
      "Nest MUD Client",
      style: Theme.of(context).textTheme.headline4!.copyWith(
            color: Theme.of(context).colorScheme.onPrimary,
          ),
    ),
    actions: [
      Container(
        padding: EdgeInsets.fromLTRB(20, 10, 5, 0),
        child: ElevatedButton(
          onPressed: () => _navigateHome(context, callbacks),
          style: ElevatedButton.styleFrom(
            primary: Theme.of(context).colorScheme.secondaryVariant,
            onPrimary: Theme.of(context).colorScheme.onSecondary,
            onSurface: Theme.of(context).colorScheme.onSecondary,
          ),
          child: Text(
            'Home',
            style: Theme.of(context).textTheme.headline6!.copyWith(
                  color: Theme.of(context).colorScheme.onPrimary,
                ),
          ),
        ),
      ),
    ],
  );
}
