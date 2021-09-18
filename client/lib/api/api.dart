import 'package:http/http.dart' as http;
import 'package:http/retry.dart';

// Application
import 'package:client/config.dart';
import 'package:client/logger.dart';

class API {
  final String hostname = config['serverHost'].toString();
  final String port = config['serverPort'].toString();

  Future<String> test() async {
    final log = getLogger('API');
    final client = RetryClient(http.Client());
    http.Response? response;
    try {
      Uri uri = Uri(
        scheme: 'http',
        host: this.hostname,
        port: int.parse(this.port),
      );
      response =
          await client.get(uri, headers: {'Content-Type': 'application/json; charset=utf-8'});
    } on http.ClientException catch (err) {
      log.warning('Failed: ${err.message}');
    } finally {
      client.close();
    }
    String responseBody = '';
    if (response != null) {
      responseBody = response.body;
    }
    log.warning('Response: ${responseBody}');
    return responseBody;
  }

  Future<String> getDungeon(String dungeonID) async {
    final log = getLogger('API');
    final client = RetryClient(http.Client());
    http.Response? response;
    try {
      Uri uri = Uri(
        scheme: 'http',
        host: this.hostname,
        port: int.parse(this.port),
        path: '/api/v1/dungeons/${dungeonID}',
      );
      log.warning('URI ${uri}');
      response =
          await client.get(uri, headers: {'Content-Type': 'application/json; charset=utf-8'});
    } on http.ClientException catch (err) {
      log.warning('Failed: ${err.message}');
    } finally {
      client.close();
    }
    String responseBody = '';
    if (response != null) {
      responseBody = response.body;
    }
    log.warning('Response: ${responseBody}');
    return responseBody;
  }

  Future<String> getDungeons() async {
    final log = getLogger('API');
    final client = RetryClient(http.Client());
    http.Response? response;
    try {
      Uri uri = Uri(
        scheme: 'http',
        host: this.hostname,
        port: int.parse(this.port),
        path: '/api/v1/dungeons',
      );
      log.warning('URI ${uri}');
      response =
          await client.get(uri, headers: {'Content-Type': 'application/json; charset=utf-8'});
    } on http.ClientException catch (err) {
      log.warning('Failed: ${err.message}');
      log.warning('Failed: ${err.uri}');
    } finally {
      client.close();
    }
    String responseBody = '';
    if (response != null) {
      responseBody = response.body;
    }
    log.warning('Response: ${responseBody}');
    return responseBody;
  }

  // TODO: Actual implementation
  Future<String> createCharacter(String dungeonID) async {
    final client = RetryClient(http.Client());
    http.Response response;
    try {
      response = await client.post(Uri.parse(this.hostname), body: {});
    } finally {
      client.close();
    }
    return response.body;
  }

  // TODO: Actual implementation
  Future<String> createAction(String dungeonID, String characterID) async {
    final client = RetryClient(http.Client());
    http.Response response;
    try {
      response = await client.post(Uri.parse(this.hostname), body: {});
    } finally {
      client.close();
    }
    return response.body;
  }
}
