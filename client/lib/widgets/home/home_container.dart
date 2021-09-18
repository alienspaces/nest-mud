import 'package:flutter/material.dart';

// Application packages
import 'package:client/logger.dart';
import 'package:client/widgets/home/home_game_list.dart';

class HomeContainerWidget extends StatefulWidget {
  const HomeContainerWidget({Key? key}) : super(key: key);

  @override
  _HomeContainerWidgetState createState() => _HomeContainerWidgetState();
}

class _HomeContainerWidgetState extends State<HomeContainerWidget> {
  @override
  Widget build(BuildContext context) {
    final log = getLogger('HomeContainer');
    log.info('Building..');

    return HomeGameListWidget();
  }
}
