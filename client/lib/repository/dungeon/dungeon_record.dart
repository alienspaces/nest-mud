// Package
part of 'dungeon_repository.dart';

class DungeonRecord extends Equatable {
  final String id;
  final String name;

  DungeonRecord({
    required this.id,
    required this.name,
  });

  DungeonRecord.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        name = json['name'];

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
      };

  @override
  List<Object> get props => [id];
}
