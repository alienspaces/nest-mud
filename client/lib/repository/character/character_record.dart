// Package
part of 'character_repository.dart';

class CreateCharacterRecord extends Equatable {
  final String name;
  final int strength;
  final int dexterity;
  final int intelligence;

  CreateCharacterRecord({
    required this.name,
    required this.strength,
    required this.dexterity,
    required this.intelligence,
  });

  CreateCharacterRecord.fromJson(Map<String, dynamic> json)
      : name = json['name'],
        strength = json['strength'],
        dexterity = json['dexterity'],
        intelligence = json['intelligence'];

  Map<String, dynamic> toJson() => {
        'name': name,
        'strength': strength,
        'dexterity': dexterity,
        'intelligence': intelligence,
      };

  @override
  List<Object?> get props => [name, strength, dexterity, intelligence];
}

class CharacterRecord extends Equatable {
  final String id;
  final String name;
  final int strength;
  final int dexterity;
  final int intelligence;
  final int? health;
  final int? fatigue;
  final int? coins;
  final int? experience_points;
  final int? attribute_points;

  CharacterRecord({
    required this.id,
    required this.name,
    required this.strength,
    required this.dexterity,
    required this.intelligence,
    this.health,
    this.fatigue,
    this.coins,
    this.experience_points,
    this.attribute_points,
  });

  CharacterRecord.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        name = json['name'],
        strength = json['strength'],
        dexterity = json['dexterity'],
        intelligence = json['intelligence'],
        health = json['health'],
        fatigue = json['fatigue'],
        coins = json['coins'],
        experience_points = json['experience_points'],
        attribute_points = json['attribute_points'];

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'strength': strength,
        'dexterity': dexterity,
        'intelligence': intelligence,
        'health': health,
        'fatigue': fatigue,
        'coins': coins,
        'experience_points': experience_points,
        'attribute_points': attribute_points,
      };

  @override
  List<Object?> get props => [id, name];
}
