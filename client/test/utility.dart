// Application
import 'package:client/api/api.dart';
import 'package:client/repository/repository.dart';

Map<String, String> getConfig() {
  return {"serverHost": "localhost", "serverPort": "3000"};
}

API getAPI() {
  return API(config: getConfig());
}

RepositoryCollection getRepositories() {
  return RepositoryCollection(config: getConfig(), api: getAPI());
}
