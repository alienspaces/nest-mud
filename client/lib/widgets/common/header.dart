import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

// Application
import 'package:client/navigation.dart';
import 'package:client/logger.dart';
import 'package:client/cubit/character/character_cubit.dart';
import 'package:client/cubit/dungeon/dungeon_cubit.dart';

void _showDialogue(BuildContext context, String content, void Function() continueFunc) {
  Widget cancelButton = ElevatedButton(
    child: Text("Cancel"),
    onPressed: () {
      Navigator.of(context).pop();
    },
  );

  Widget continueButton = ElevatedButton(
    child: Text("Continue"),
    onPressed: () {
      Navigator.of(context).pop();
      continueFunc();
    },
  );

  AlertDialog alert = AlertDialog(
    content: Text(content),
    actions: [
      cancelButton,
      continueButton,
    ],
  );

  showDialog(
    context: context,
    useRootNavigator: false,
    builder: (BuildContext context) {
      return alert;
    },
  );
}

void _navigateHome(BuildContext context, NavigationCallbacks callbacks) {
  final log = getLogger('Header');

  _showDialogue(context, 'Exit the game?', () {
    final characterCubit = BlocProvider.of<CharacterCubit>(context);
    characterCubit.clearCharacter();
    final dungeonCubit = BlocProvider.of<DungeonCubit>(context);
    dungeonCubit.clearDungeon();

    log.info('Navigating to home page...');
    callbacks.openHomePage();
  });
}

void _navigateCharacter(BuildContext context, NavigationCallbacks callbacks) {
  final log = getLogger('Header');

  log.info('Navigating to character page...');
  callbacks.openCharacterPage();
}

void _navigateGame(BuildContext context, NavigationCallbacks callbacks) {
  final log = getLogger('Header');

  log.info('Navigating to game page...');
  callbacks.openGamePage();
}

Widget _buildLink(BuildContext context, String label, void Function() navigateFunc) {
  return Container(
    padding: EdgeInsets.fromLTRB(20, 10, 5, 0),
    child: ElevatedButton(
      onPressed: navigateFunc,
      style: ElevatedButton.styleFrom(
        primary: Theme.of(context).colorScheme.secondaryVariant,
        onPrimary: Theme.of(context).colorScheme.onSecondary,
        onSurface: Theme.of(context).colorScheme.onSecondary,
      ),
      child: Text(
        label,
        style: Theme.of(context).textTheme.button!.copyWith(
              fontSize: 18,
              color: Theme.of(context).colorScheme.onPrimary,
            ),
      ),
    ),
  );
}

AppBar header(BuildContext context, NavigationCallbacks callbacks) {
  final characterCubit = BlocProvider.of<CharacterCubit>(context);
  final dungeonCubit = BlocProvider.of<DungeonCubit>(context);

  List<Widget> links = [];

  if (characterCubit.characterRecord != null) {
    links.add(
      _buildLink(context, 'Home', () => _navigateHome(context, callbacks)),
    );
  }

  if (characterCubit.characterRecord != null) {
    links.add(
      _buildLink(context, 'Character', () => _navigateCharacter(context, callbacks)),
    );
  }

  if (characterCubit.characterRecord != null && dungeonCubit.dungeonRecord != null) {
    links.add(
      _buildLink(context, 'Dungeon', () => _navigateGame(context, callbacks)),
    );
  }

  return AppBar(
    title: Container(
      child: Column(
        children: <Widget>[
          Text(
            "Dungeon",
            style: Theme.of(context).textTheme.headline6!.copyWith(
                  color: Theme.of(context).colorScheme.onPrimary,
                ),
          ),
          Text(
            "Doom",
            style: Theme.of(context).textTheme.headline6!.copyWith(
                  color: Theme.of(context).colorScheme.onPrimary,
                ),
          ),
        ],
      ),
    ),
    actions: links,
  );
}
