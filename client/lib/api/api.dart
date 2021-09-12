import 'package:http/http.dart' as http;
import 'package:http/retry.dart';

class API {
  Future<String> test() async {
    final client = RetryClient(http.Client());
    String response;
    try {
      response = await client.read(Uri(host: 'example.org', scheme: 'http'));
    } finally {
      client.close();
    }
    return response;
  }
}
