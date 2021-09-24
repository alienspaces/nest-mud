// Package
part of 'dungeon_action_repository.dart';

class CreateDungeonActionRecord extends Equatable {
  final String sentence;

  CreateDungeonActionRecord({
    required this.sentence,
  });

  CreateDungeonActionRecord.fromJson(Map<String, dynamic> json) : sentence = json['sentence'];

  Map<String, dynamic> toJson() => {
        'sentence': sentence,
      };

  @override
  List<Object> get props => [sentence];
}

class DungeonActionRecord extends Equatable {
  final String id;
  final String name;

  DungeonActionRecord({
    required this.id,
    required this.name,
  });

  DungeonActionRecord.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        name = json['name'];

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
      };

  @override
  List<Object> get props => [id];
}
