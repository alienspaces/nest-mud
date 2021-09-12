import 'package:flutter/material.dart';

// Application packages
import 'package:client/logger.dart';

class GameBoardWidget extends StatefulWidget {
  const GameBoardWidget({Key? key}) : super(key: key);

  @override
  _GameBoardWidgetState createState() => _GameBoardWidgetState();
}

class _GameBoardWidgetState extends State<GameBoardWidget> {
  @override
  Widget build(BuildContext context) {
    final log = getLogger('GameBoard');
    log.info('Building..');

    return Container();
  }
}
