import 'package:client/widgets/home/home_container.dart';
import 'package:flutter/material.dart';

// Application packages
import 'package:client/navigation.dart';
import 'package:client/logger.dart';
import 'package:client/widgets/common/header.dart';

class HomePage extends Page {
  static const String pageName = 'HomePage';
  final NavigationCallbacks callbacks;

  HomePage({
    LocalKey key = const ValueKey(HomePage.pageName),
    name = HomePage.pageName,
    required this.callbacks,
  }) : super(key: key, name: name);

  Route createRoute(BuildContext context) {
    return MaterialPageRoute(
      settings: this,
      builder: (BuildContext context) {
        return HomeScreen(
          callbacks: callbacks,
        );
      },
    );
  }
}

class HomeScreen extends StatefulWidget {
  final NavigationCallbacks callbacks;
  static String pageName = 'Home';

  HomeScreen({
    Key? key,
    required this.callbacks,
  }) : super(key: key);

  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  Widget build(BuildContext context) {
    final log = getLogger('HomeScreen');
    log.info('Building..');

    return Scaffold(
      appBar: header(context, widget.callbacks),
      body: Container(
        padding: EdgeInsets.symmetric(vertical: 16),
        alignment: Alignment.center,
        child: HomeContainerWidget(),
      ),
    );
  }
}
