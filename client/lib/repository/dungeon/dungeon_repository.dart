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
  @override
  Future<DungeonRecord?> getOne(String dungeonID) async {
    final log = getLogger('DungeonRepository');
    final api = API();
    String response = await api.getDungeon(dungeonID);
    Map<String, dynamic> decoded = jsonDecode(response);
    log.warning('Decoded response ${decoded}');
    final record = DungeonRecord.fromJson(decoded);
    return record;
  }

  Future<List<DungeonRecord>> getMany() async {
    final log = getLogger('DungeonRepository');
    final api = API();
    String response = await api.getDungeons();
    Map<String, dynamic> decoded = jsonDecode(response);
    List<DungeonRecord> records = [];
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
