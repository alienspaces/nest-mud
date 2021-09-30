// Application
import 'package:client/api/api.dart';
import 'package:client/repository/repository.dart';

Map<String, String> getConfig() {
  return {"serverHost": "localhost", "serverPort": "3000"};
}

class MockAPI implements API {
  final Map<String, String> config;
  late final String hostname;
  late final String port;

  MockAPI({required this.config}) {}

  Future<APIResponse> test() async {
    return Future.value(APIResponse(body: ''));
  }

  Future<APIResponse> getDungeon(String dungeonID) async {
    return Future.value(APIResponse(body: ''));
  }

  Future<APIResponse> getDungeons() async {
    return Future.value(APIResponse(body: ''));
  }

  Future<APIResponse> createCharacter(
    String dungeonID, {
    required String name,
    required int strength,
    required int dexterity,
    required int intelligence,
  }) async {
    return Future.value(APIResponse(body: ''));
  }

  Future<APIResponse> loadCharacter(String dungeonID, String characterID) async {
    return Future.value(APIResponse(body: ''));
  }

  Future<APIResponse> createDungeonAction(
    String dungeonID,
    String characterID,
    String sentence,
  ) async {
    return Future.value(APIResponse(body: ''));
  }
}

API getMockAPI() {
  return MockAPI(config: getConfig());
}

API getAPI() {
  return API(config: getConfig());
}

RepositoryCollection getRepositories({bool mockAPI = false}) {
  final API api = mockAPI ? getMockAPI() : getAPI();
  return RepositoryCollection(config: getConfig(), api: api);
}
