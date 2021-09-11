import 'package:flutter/material.dart';

// Application packages
import 'package:client/logger.dart';
import 'package:client/theme.dart';
import 'package:client/navigation.dart';

void main() {
  // Initialise logger
  initLogger();

  // Run application
  runApp(MainApp());
}

class MainApp extends StatelessWidget {
  final log = getLogger('CardFlipApp');

  @override
  Widget build(BuildContext context) {
    log.info('Building..');
    return MaterialApp(
      title: 'Nest MUD Client',
      theme: getTheme(context),
      home: Navigation(),
    );
  }
}
