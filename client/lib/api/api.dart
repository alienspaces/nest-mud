import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:http/retry.dart';

// Application
import 'package:client/logger.dart';
import 'package:flutter/foundation.dart' show kIsWeb;

class APIResponse {
  String? body;
  String? error;
  APIResponse({this.body, this.error});

  bool isNotEmpty() {
    return this.body != null || this.error != null;
  }
}

class API {
  final Map<String, String> config;
  late final String hostname;
  late final String port;

  API({required this.config}) {
    this.hostname = config['serverHost'].toString();
    this.port = config['serverPort'].toString();
  }

  Future<APIResponse> test() async {
    final log = getLogger('API');
    final client = RetryClient(http.Client());
    log.warning('Testing hostname ${this.hostname} port ${this.port}');

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
      return APIResponse(error: err.message);
    } finally {
      client.close();
    }

    String responseBody = response.body;
    log.warning('Response: ${responseBody}');

    return APIResponse(body: responseBody);
  }

  Future<APIResponse> getDungeon(String dungeonID) async {
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
      return APIResponse(error: err.message);
    } finally {
      client.close();
    }

    String responseBody = response.body;
    log.warning('Response: ${responseBody}');

    return APIResponse(body: responseBody);
  }

  Future<APIResponse> getDungeons() async {
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
      return APIResponse(error: err.message);
    } finally {
      client.close();
    }

    String responseBody = response.body;
    log.warning('Response: ${responseBody}');

    return APIResponse(body: responseBody);
  }

  Future<APIResponse> createCharacter(
    String dungeonID, {
    required String name,
    required int strength,
    required int dexterity,
    required int intelligence,
  }) async {
    final log = getLogger('API');
    final client = RetryClient(http.Client());

    http.Response? response;
    try {
      Uri uri = Uri(
        scheme: 'http',
        host: this.hostname,
        port: int.parse(this.port),
        path: '/api/v1/dungeons/${dungeonID}/characters',
      );
      log.warning('URI ${uri}');

      String bodyData = jsonEncode({
        "data": {
          "name": '${name}',
          "strength": strength,
          "dexterity": dexterity,
          "intelligence": intelligence,
        },
      });
      log.warning('bodyData ${bodyData}');

      response = await client.post(
        uri,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: bodyData,
      );
    } on http.ClientException catch (err) {
      log.warning('Failed: ${err.message}');
      return APIResponse(error: err.message);
    } finally {
      client.close();
    }

    String responseBody = response.body;
    log.warning('Response: ${responseBody}');

    return APIResponse(body: responseBody);
  }

  Future<APIResponse> loadCharacter(String dungeonID, String characterID) async {
    final log = getLogger('API');
    final client = RetryClient(http.Client());

    http.Response? response;
    try {
      Uri uri = Uri(
        scheme: 'http',
        host: this.hostname,
        port: int.parse(this.port),
        path: '/api/v1/dungeons/${dungeonID}/characters/${characterID}',
      );
      log.warning('URI ${uri}');

      response = await client.get(
        uri,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      );
    } on http.ClientException catch (err) {
      log.warning('Failed: ${err.message}');
      return APIResponse(error: err.message);
    } finally {
      client.close();
    }

    String responseBody = response.body;
    log.warning('Response: ${responseBody}');

    return APIResponse(body: responseBody);
  }

  Future<APIResponse> createDungeonAction(
    String dungeonID,
    String characterID,
    String sentence,
  ) async {
    final log = getLogger('API');
    final client = RetryClient(http.Client());

    http.Response? response;
    try {
      Uri uri = Uri(
        scheme: 'http',
        host: this.hostname,
        port: int.parse(this.port),
        path: '/api/v1/dungeons/${dungeonID}/characters/${characterID}/actions',
      );
      log.warning('URI ${uri}');

      String bodyData = jsonEncode({
        "data": {
          "sentence": '${sentence}',
        },
      });
      log.warning('bodyData ${bodyData}');

      response = await client.post(
        uri,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: bodyData,
      );
    } on http.ClientException catch (err) {
      log.warning('Failed: ${err.message}');
      return APIResponse(error: err.message);
    } finally {
      client.close();
    }

    String responseBody = response.body;
    log.warning('Response: ${responseBody}');

    return APIResponse(body: responseBody);
  }
}
