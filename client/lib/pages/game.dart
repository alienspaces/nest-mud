import 'package:flutter/material.dart';

// Application packages
import 'package:client/navigation.dart';
import 'package:client/logger.dart';
import 'package:client/widgets/common/header.dart';

class GamePage extends Page {
  static const String pageName = 'GamePage';
  final NavigationCallbacks callbacks;

  GamePage({
    LocalKey key = const ValueKey(GamePage.pageName),
    name = GamePage.pageName,
    required this.callbacks,
  }) : super(key: key, name: name);

  Route createRoute(BuildContext context) {
    return MaterialPageRoute(
      settings: this,
      builder: (BuildContext context) {
        return GameScreen(
          callbacks: callbacks,
        );
      },
    );
  }
}

class GameScreen extends StatefulWidget {
  final NavigationCallbacks callbacks;
  static String pageName = 'Game';

  GameScreen({
    Key? key,
    required this.callbacks,
  }) : super(key: key);

  @override
  _GameScreenState createState() => _GameScreenState();
}

class _GameScreenState extends State<GameScreen> {
  @override
  Widget build(BuildContext context) {
    final log = getLogger('GamePage - build');
    log.info('Building..');

    return Scaffold(
      appBar: header(context, widget.callbacks),
      body: Container(
        padding: EdgeInsets.symmetric(vertical: 16),
        alignment: Alignment.center,
        child: Text('Welcome'),
      ),
    );
  }
}
