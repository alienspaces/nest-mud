import 'dart:convert';
import 'package:equatable/equatable.dart';

// Application
import 'package:client/logger.dart';
import 'package:client/api/api.dart';
import 'package:client/repository/repository.dart';

// Package
part 'dungeon_action_record.dart';

abstract class DungeonActionRepositoryInterface {
  Future<DungeonActionRecord?> create(String dungeonID, String characterID, String sentence);
}

class DungeonActionRepository implements DungeonActionRepositoryInterface {
  final Map<String, String> config;
  final API api;

  DungeonActionRepository({required this.config, required this.api});

  Future<DungeonActionRecord?> create(String dungeonID, String characterID, String sentence) async {
    final log = getLogger('DungeonActionRepository');

    APIResponse response = await api.createDungeonAction(
      dungeonID,
      characterID,
      sentence,
    );
    if (response.error != null) {
      log.warning('No records returned');
      RepositoryException exception = resolveApiException(response.error!);
      throw exception;
    }

    DungeonActionRecord? record;
    String? responseBody = response.body;
    if (responseBody != null && responseBody.isNotEmpty) {
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
