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
    return MaterialPageRoute(
      settings: this,
      builder: (BuildContext context) {
        return CharacterScreen(
          callbacks: callbacks,
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
