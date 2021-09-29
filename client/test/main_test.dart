import 'package:flutter_test/flutter_test.dart';

// Application
import 'package:client/main.dart';

// Local Test Utilities
import './utility.dart';

void main() {
  testWidgets('Application displays expected', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(MainApp(
      config: getConfig(),
      repositories: getRepositories(),
    ));

    // expect(find.text('Dungeon'), findsOneWidget);
  });
}
