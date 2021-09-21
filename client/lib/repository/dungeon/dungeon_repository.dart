import 'dart:convert';
import 'package:equatable/equatable.dart';

// Application
import 'package:client/logger.dart';
import 'package:client/api/api.dart';

// Package
part 'dungeon_record.dart';

abstract class DungeonRepositoryInterface {
  Future<DungeonRecord?> getOne(String dungeonID);
  Future<List<DungeonRecord?>> getMany();
}

class DungeonRepository implements DungeonRepositoryInterface {
  Future<DungeonRecord?> getOne(String dungeonID) async {
    final log = getLogger('DungeonRepository');
    final api = API();
    String response = await api.getDungeon(dungeonID);
    if (response == '') {
      log.warning('No record returned');
      return null;
    }
    Map<String, dynamic> decoded = jsonDecode(response);
    log.warning('Decoded response ${decoded}');
    final record = DungeonRecord.fromJson(decoded);
    return record;
  }

  Future<List<DungeonRecord>> getMany() async {
    final log = getLogger('DungeonRepository');
    final api = API();
    String response = await api.getDungeons();
    List<DungeonRecord> records = [];
    if (response == '') {
      log.warning('No records returned');
      return records;
    }
    Map<String, dynamic> decoded = jsonDecode(response);
    if (decoded['data'] != null) {
      List<dynamic> data = decoded['data'];
      log.warning('Decoded response ${data}');
      data.forEach((element) {
        records.add(DungeonRecord.fromJson(element));
      });
    }
    return records;
  }
}
