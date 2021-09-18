import 'package:flutter_test/flutter_test.dart';

// Application
import 'package:client/main.dart';

void main() {
  testWidgets('Application displays expected', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(MainApp());

    expect(find.text('Nest MUD Client'), findsOneWidget);
  });
}
