import 'package:client/repository/dungeon/dungeon_repository.dart';
import 'package:flutter/material.dart';

class HomeGameWidget extends StatelessWidget {
  final DungeonRecord dungeonRecord;
  const HomeGameWidget({Key? key, required this.dungeonRecord}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(child: Text('${dungeonRecord.id} ${dungeonRecord.name}'));
  }
}
