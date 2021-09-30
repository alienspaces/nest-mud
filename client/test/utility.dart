// Application
import 'package:client/api/api.dart';
import 'package:client/repository/repository.dart';
import 'dart:io' show Platform;

Map<String, String> getConfig() {
  Map<String, String> envVars = Platform.environment;

  String? serverHost = envVars['APP_CLIENT_API_HOST'];
  String? serverPort = envVars['APP_CLIENT_API_PORT'];

  if (serverHost == null) {
    throw Exception('Test setup failure, environment missing APP_CLIENT_API_HOST');
  }

  if (serverPort == null) {
    throw Exception('Test setup failure, environment missing APP_CLIENT_API_PORT');
  }

  return {
    "serverHost": envVars['APP_CLIENT_API_HOST'] ?? '',
    "serverPort": envVars['APP_CLIENT_API_PORT'] ?? '',
  };
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
