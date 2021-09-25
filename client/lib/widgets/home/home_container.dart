import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

// Application packages
import 'package:client/navigation.dart';
import 'package:client/logger.dart';
import 'package:client/cubit/dungeon/dungeon_cubit.dart';
import 'package:client/widgets/home/home_dungeon.dart';

class HomeContainerWidget extends StatefulWidget {
  final NavigationCallbacks callbacks;

  const HomeContainerWidget({Key? key, required this.callbacks}) : super(key: key);

  @override
  _HomeContainerWidgetState createState() => _HomeContainerWidgetState();
}

class _HomeContainerWidgetState extends State<HomeContainerWidget> {
  @override
  void initState() {
    final log = getLogger('HomeContainerWidget');
    log.info('Initialising state..');

    super.initState();

    _loadDungeons(context);
  }

  void _loadDungeons(BuildContext context) {
    final log = getLogger('HomeContainerWidget');
    log.info('Loading dungeons');

    final dungeonCubit = BlocProvider.of<DungeonCubit>(context);
    dungeonCubit.loadDungeons();
  }

  // TODO: Consider separating out dungeon container and character container, when
  // a dungeon is selected the dungeon container will display an empy container, when
  // no dungeon is selected the character container will display an empty container,
  // maybe much cleaner layout and logic..

  @override
  Widget build(BuildContext context) {
    final log = getLogger('HomeContainerWidget');
    log.info('Building..');

    return BlocConsumer<DungeonCubit, DungeonState>(
      listener: (context, state) {
        log.info('listener...');
      },
      builder: (BuildContext context, DungeonState state) {
        log.info('builder...');
        List<Widget> widgets = [];

        if (state is DungeonStateLoaded) {
          // Dungeon not selected
          state.dungeonRecords?.forEach((dungeonRecord) {
            log.info('Displaying dungeon widget');
            widgets.add(
              Container(
                child: HomeDungeonWidget(
                  callbacks: widget.callbacks,
                  dungeonRecord: dungeonRecord,
                ),
              ),
            );
          });
        } else {
          widgets.add(
            Container(
              child: Text('Loading dungeons...'),
            ),
          );
        }

        return Container(
          child: Column(
            children: widgets,
          ),
        );
      },
    );
  }
}
