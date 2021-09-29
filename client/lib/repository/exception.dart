class RepositoryException implements Exception {
  final String message;
  RepositoryException(this.message);

  String toString() => "RepositoryException: $message";
}

class DuplicateCharacterNameRepositoryException extends RepositoryException {
  DuplicateCharacterNameRepositoryException(String message) : super(message) {}
}

RepositoryException resolveException(String message) {
  return RepositoryException(message);
}
