part of 'character_repository.dart';

class CharacterRecord extends Equatable {
  final int id;
  final String name;

  CharacterRecord({
    required this.id,
    required this.name,
  });

  CharacterRecord.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        name = json['name'];

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
      };

  @override
  List<Object> get props => [id];
}
