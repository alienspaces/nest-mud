import 'package:logging/logging.dart';

Logger? logger;

void initLogger() {
  Logger.root.level = Level.INFO;
  Logger.root.onRecord.listen((record) {
    print('${record.level.name}: ${record.time}: ${record.message}');
  });
}

Logger getLogger(String name) {
  logger = Logger(name);
  return logger!;
}
