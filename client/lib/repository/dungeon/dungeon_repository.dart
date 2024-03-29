import 'dart:convert';
import 'package:equatable/equatable.dart';

// Application
import 'package:client/logger.dart';
import 'package:client/api/api.dart';
import 'package:client/repository/repository.dart';

// Package
part 'dungeon_record.dart';

abstract class DungeonRepositoryInterface {
  Future<DungeonRecord?> getOne(String dungeonID);
  Future<List<DungeonRecord?>> getMany();
}

class DungeonRepository implements DungeonRepositoryInterface {
  final Map<String, String> config;
  final API api;

  DungeonRepository({required this.config, required this.api});

  Future<DungeonRecord?> getOne(String dungeonID) async {
    final log = getLogger('DungeonRepository');

    APIResponse response = await api.getDungeon(dungeonID);
    if (response.error != null) {
      log.warning('API responded with error ${response.error}');
      RepositoryException exception = resolveApiException(response.error!);
      throw exception;
    }

    DungeonRecord? record;
    String? responseBody = response.body;
    if (responseBody != null && responseBody.isNotEmpty) {
      Map<String, dynamic> decoded = jsonDecode(responseBody);
      log.warning('Decoded response ${decoded}');
      record = DungeonRecord.fromJson(decoded);
    }

    return record;
  }

  Future<List<DungeonRecord>> getMany() async {
    final log = getLogger('DungeonRepository');

    APIResponse response = await api.getDungeons();
    if (response.error != null) {
      log.warning('API responded with error ${response.error}');
      RepositoryException exception = resolveApiException(response.error!);
      throw exception;
    }

    List<DungeonRecord> records = [];
    String? responseBody = response.body;
    if (responseBody != null && responseBody.isNotEmpty) {
      Map<String, dynamic> decoded = jsonDecode(responseBody);
      if (decoded['data'] != null) {
        List<dynamic> data = decoded['data'];
        log.info('Decoded response ${data}');
        data.forEach((element) {
          records.add(DungeonRecord.fromJson(element));
        });
      }
    }

    return records;
  }
}
