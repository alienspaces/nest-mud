import 'package:flutter/material.dart';

// Application packages
import 'package:client/navigation.dart';
import 'package:client/logger.dart';
import 'package:client/widgets/common/header.dart';
import 'package:client/widgets/game/game_container.dart';

class GamePage extends Page {
  static const String pageName = 'GamePage';
  final NavigationCallbacks callbacks;

  GamePage({
    LocalKey key = const ValueKey(GamePage.pageName),
    name = GamePage.pageName,
    required this.callbacks,
  }) : super(key: key, name: name);

  Route createRoute(BuildContext context) {
    return PageRouteBuilder(
      settings: this,
      pageBuilder: (context, animation, secondaryAnimation) {
        return GameScreen(
          callbacks: callbacks,
        );
      },
      transitionDuration: Duration(milliseconds: 300),
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        const begin = 0.0;
        const end = 1.0;
        final tween = Tween(begin: begin, end: end);
        final opacityAnimation = animation.drive(tween);
        return FadeTransition(
          opacity: opacityAnimation,
          child: child,
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
    final log = getLogger('GameScreen');
    log.info('Building..');

    return Scaffold(
      appBar: header(context, widget.callbacks),
      resizeToAvoidBottomInset: false,
      body: Container(
        padding: EdgeInsets.symmetric(vertical: 16),
        alignment: Alignment.center,
        child: GameContainerWidget(),
      ),
    );
  }
}
