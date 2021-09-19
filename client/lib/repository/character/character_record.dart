// Package
part of 'character_repository.dart';

class CharacterRecord extends Equatable {
  final int? id;
  final String name;
  final int strength;
  final int dexterity;
  final int intelligence;

  CharacterRecord({
    this.id,
    required this.name,
    required this.strength,
    required this.dexterity,
    required this.intelligence,
  });

  CharacterRecord.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        name = json['name'],
        strength = json['strength'],
        dexterity = json['dexterity'],
        intelligence = json['intelligence'];

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'strength': strength,
        'dexterity': dexterity,
        'intelligence': intelligence,
      };

  @override
  List<Object?> get props => [id, name];
}
