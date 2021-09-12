import 'package:http/http.dart' as http;
import 'package:http/retry.dart';

class API {
  final String hostname;

  API({required this.hostname});

  Future<String> test() async {
    final client = RetryClient(http.Client());
    String response;
    try {
      response = await client.read(Uri(scheme: 'https', host: this.hostname));
    } finally {
      client.close();
    }
    return response;
  }

  // TODO: Actual implementation
  Future<String> getDungeons() async {
    final client = RetryClient(http.Client());
    String response;
    try {
      response = await client.read(Uri(scheme: 'https', host: '${this.hostname}/api/dungeons'));
    } finally {
      client.close();
    }
    return response;
  }

  // TODO: Actual implementation
  Future<String> createCharacter(String dungeonID) async {
    final client = RetryClient(http.Client());
    http.Response response;
    try {
      response = await client.post(
          Uri(scheme: 'https', host: '${this.hostname}/api/dungeons/${dungeonID}/characters'),
          body: {});
    } finally {
      client.close();
    }
    return response.body;
  }

  // TODO: Actual implementation
  Future<String> createAction(String dungeonID) async {
    final client = RetryClient(http.Client());
    http.Response response;
    try {
      response = await client.post(
          Uri(scheme: 'https', host: '${this.hostname}/api/dungeons/${dungeonID}/actions'),
          body: {});
    } finally {
      client.close();
    }
    return response.body;
  }
}
