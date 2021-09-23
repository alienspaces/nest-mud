import 'dart:convert';
import 'package:equatable/equatable.dart';

// Application
import 'package:client/logger.dart';
import 'package:client/api/api.dart';

// Package
part 'character_record.dart';

abstract class CharacterRepositoryInterface {
  Future<CharacterRecord?> create(String dungeonID, CharacterRecord record);
}

class CharacterRepository implements CharacterRepositoryInterface {
  Future<CharacterRecord?> create(String dungeonID, CharacterRecord record) async {
    final log = getLogger('CharacterRepository');

    final api = API();
    String response = await api.createCharacter(
      dungeonID,
      name: record.name,
      strength: record.strength,
      dexterity: record.dexterity,
      intelligence: record.intelligence,
    );
    if (response == '') {
      log.warning('No records returned');
      return null;
    }

    Map<String, dynamic> decoded = jsonDecode(response);
    if (decoded['data'] != null) {
      List<dynamic> data = decoded['data'];
      log.warning('Decoded response ${data}');
      if (data.length > 1) {
        log.warning('Unexpected number of records returned');
        return null;
      }
      record = CharacterRecord.fromJson(data[0]);
    }

    return record;
  }

  Future<CharacterRecord?> load(String dungeonID, String characterID) async {
    final log = getLogger('CharacterRepository');

    final api = API();
    String response = await api.loadCharacter(
      dungeonID,
      characterID,
    );
    if (response == '') {
      log.warning('No records returned');
      return null;
    }

    CharacterRecord? record;
    Map<String, dynamic> decoded = jsonDecode(response);
    if (decoded['data'] != null) {
      List<dynamic> data = decoded['data'];
      log.warning('Decoded response ${data}');
      if (data.length > 1) {
        log.warning('Unexpected number of records returned');
        return null;
      }
      record = CharacterRecord.fromJson(data[0]);
    }

    return record;
  }
}
