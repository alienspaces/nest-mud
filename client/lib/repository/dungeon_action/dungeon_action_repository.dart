import 'dart:convert';
import 'package:equatable/equatable.dart';

// Application
import 'package:client/logger.dart';
import 'package:client/api/api.dart';

// Package
part 'dungeon_action_record.dart';

abstract class DungeonActionRepositoryInterface {
  Future<DungeonActionRecord?> create(String dungeonID, String characterID, String sentence);
}

class DungeonActionRepository implements DungeonActionRepositoryInterface {
  Future<DungeonActionRecord?> create(String dungeonID, String characterID, String sentence) async {
    final log = getLogger('DungeonActionRepository');

    final api = API();
    String response = await api.createDungeonAction(
      dungeonID,
      characterID,
      sentence,
    );
    if (response == '') {
      log.warning('No records returned');
      return null;
    }

    DungeonActionRecord? record;
    Map<String, dynamic> decoded = jsonDecode(response);
    if (decoded['data'] != null) {
      List<dynamic> data = decoded['data'];
      log.warning('Decoded response ${data}');
      if (data.length > 1) {
        log.warning('Unexpected number of records returned');
        return null;
      }
      record = DungeonActionRecord.fromJson(data[0]);
    }

    return record;
  }
}
