import 'dart:convert';
import 'dart:io';

// Generates lib/env.dart from current environment
// USAGE: dart tool/generate_config.dart
Future<void> main() async {
  final config = {
    'serverHost': Platform.environment['APP_SERVER_HOST'],
  };

  final filename = 'lib/config.dart';
  await File(filename).writeAsString('final config = ${json.encode(config)};');
}
