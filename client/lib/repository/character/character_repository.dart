import 'dart:convert';
import 'package:equatable/equatable.dart';

// Application
import 'package:client/logger.dart';
import 'package:client/api/api.dart';

// Package
part 'character_record.dart';

abstract class CharacterRepositoryInterface {
  Future<CharacterRecord?> create(String dungeonID, CreateCharacterRecord record);
}

class CharacterRepository implements CharacterRepositoryInterface {
  Future<CharacterRecord?> create(String dungeonID, CreateCharacterRecord createRecord) async {
    final log = getLogger('CharacterRepository');

    final api = API();
    APIResponse response = await api.createCharacter(
      dungeonID,
      name: createRecord.name,
      strength: createRecord.strength,
      dexterity: createRecord.dexterity,
      intelligence: createRecord.intelligence,
    );
    if (response.error != null) {
      log.warning('API responded with error ${response.error}');
      // TODO: Translate API error to a typed exception
      throw Exception(response.error);
    }

    CharacterRecord? record;
    String? responseBody = response.body;
    if (responseBody != null) {
      Map<String, dynamic> decoded = jsonDecode(responseBody);
      if (decoded['data'] != null) {
        List<dynamic> data = decoded['data'];
        log.info('Decoded response ${data}');
        if (data.length > 1) {
          log.warning('Unexpected number of records returned');
          throw Exception('Unexpected number of records returned');
        }
        record = CharacterRecord.fromJson(data[0]);
      }
    }

    return record;
  }

  Future<CharacterRecord?> load(String dungeonID, String characterID) async {
    final log = getLogger('CharacterRepository');

    final api = API();
    APIResponse response = await api.loadCharacter(
      dungeonID,
      characterID,
    );
    if (response.error != null) {
      log.warning('API responded with error ${response.error}');
      // TODO: Translate API error to a typed exception
      throw Exception(response.error);
    }

    CharacterRecord? record;
    String? responseBody = response.body;
    if (responseBody != null) {
      Map<String, dynamic> decoded = jsonDecode(responseBody);
      if (decoded['data'] != null) {
        List<dynamic> data = decoded['data'];
        log.info('Decoded response ${data}');
        if (data.length > 1) {
          log.warning('Unexpected number of records returned');
          throw Exception('Unexpected number of records returned');
        }
        record = CharacterRecord.fromJson(data[0]);
      }
    }

    return record;
  }
}
