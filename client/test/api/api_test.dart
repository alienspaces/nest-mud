import 'package:flutter_test/flutter_test.dart';

// Application
import 'package:client/api/api.dart';

void main() {
  test('API should ', () async {
    final api = API();
    expect(api, isNotNull);
    expect(await api.test(), isNotEmpty);
  });
}
