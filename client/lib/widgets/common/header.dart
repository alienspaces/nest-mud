import 'package:flutter/material.dart';

// Application
import 'package:client/navigation.dart';

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
          onPressed: callbacks.openHomePage,
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
