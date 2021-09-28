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
    APIResponse response = await api.createDungeonAction(
      dungeonID,
      characterID,
      sentence,
    );
    if (response.error != null) {
      log.warning('No records returned');
      // TODO: Translate API error to a typed exception
      throw Exception(response.error);
    }

    DungeonActionRecord? record;
    String? responseBody = response.body;
    if (responseBody != null) {
      Map<String, dynamic> decoded = jsonDecode(responseBody);
      if (decoded['data'] != null) {
        List<dynamic> data = decoded['data'];
        log.info('Decoded response ${data}');
        if (data.length > 1) {
          // TODO: Support multiple dungeon actions in response as the response may contain
          // dungeon actions performed by other entities in the same location since our last
          // action.
          log.warning('Unexpected number of records returned');
          throw Exception('Unexpected number of records returned');
        }
        record = DungeonActionRecord.fromJson(data[0]);
      }
    }

    return record;
  }
}
