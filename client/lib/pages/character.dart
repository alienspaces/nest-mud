import 'package:flutter/material.dart';

// Application packages
import 'package:client/navigation.dart';
import 'package:client/logger.dart';
import 'package:client/widgets/common/header.dart';
import 'package:client/widgets/character/character_container.dart';

class CharacterPage extends Page {
  static const String pageName = 'CharacterPage';
  final NavigationCallbacks callbacks;

  CharacterPage({
    LocalKey key = const ValueKey(CharacterPage.pageName),
    name = CharacterPage.pageName,
    required this.callbacks,
  }) : super(key: key, name: name);

  Route createRoute(BuildContext context) {
    return PageRouteBuilder(
      settings: this,
      pageBuilder: (context, animation, secondaryAnimation) {
        return CharacterScreen(
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

class CharacterScreen extends StatefulWidget {
  final NavigationCallbacks callbacks;
  static String pageName = 'Character';

  CharacterScreen({
    Key? key,
    required this.callbacks,
  }) : super(key: key);

  @override
  _CharacterScreenState createState() => _CharacterScreenState();
}

class _CharacterScreenState extends State<CharacterScreen> {
  @override
  Widget build(BuildContext context) {
    final log = getLogger('CharacterScreen');
    log.info('Building..');

    return Scaffold(
      appBar: header(context, widget.callbacks),
      body: Container(
        padding: EdgeInsets.symmetric(vertical: 16),
        alignment: Alignment.center,
        child: CharacterContainerWidget(callbacks: widget.callbacks),
      ),
    );
  }
}
