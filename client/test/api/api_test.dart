import 'package:flutter_test/flutter_test.dart';

// Application
import 'package:client/api/api.dart';

void main() {
  test('API should ', () async {
    final api = API(hostname: 'http://nest-mud-server:3000');
    expect(api, isNotNull);
    expect(await api.test(), isNotEmpty);
  });
}
