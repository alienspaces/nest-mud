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
  final DungeonAction action;
  final DungeonLocation location;

  DungeonActionRecord({
    required this.action,
    required this.location,
  });

// List<Image> imagesList = list.map((i) => Image.fromJson(i)).toList();

  factory DungeonActionRecord.fromJson(Map<String, dynamic> json) {
    DungeonAction? dungeonAction;
    Map<String, dynamic>? action = json['action'];
    if (action == null) {
      throw FormatException('Missing "action" from JSON');
    }
    dungeonAction = DungeonAction(
      id: action['id'],
      command: action['command'],
      command_result: action['command_result'],
      equipped_dungeon_object_name: action['equipped_dungeon_object_name'],
      stashed_dungeon_object_name: action['stashed_dungeon_object_name'],
      target_dungeon_object_name: action['target_dungeon_object_name'],
      target_dungeon_character_name: action['target_dungeon_character_name'],
      target_dungeon_monster_name: action['target_dungeon_monster_name'],
      target_dungeon_location_direction: action['target_dungeon_location_direction'],
      target_dungeon_location_name: action['target_dungeon_location_name'],
    );

    DungeonLocation? dungeonLocation;
    Map<String, dynamic>? location = json['location'];
    if (location == null) {
      throw FormatException('Missing "location" from JSON');
    }

    List<dynamic> directions = location['directions'];

    dungeonLocation = DungeonLocation(
      name: location['name'],
      description: location['description'],
      directions: directions.map((e) => e.toString()).toList(),
    );

    return DungeonActionRecord(
      action: dungeonAction,
      location: dungeonLocation,
    );
  }

  @override
  List<Object> get props => [
        action,
        location,
      ];
}

class DungeonAction {
  final String id;
  final String command;
  final String? command_result;
  final String? equipped_dungeon_object_name;
  final String? stashed_dungeon_object_name;
  final String? target_dungeon_object_name;
  final String? target_dungeon_character_name;
  final String? target_dungeon_monster_name;
  final String? target_dungeon_location_direction;
  final String? target_dungeon_location_name;

  DungeonAction({
    required this.id,
    required this.command,
    this.command_result,
    this.equipped_dungeon_object_name,
    this.stashed_dungeon_object_name,
    this.target_dungeon_object_name,
    this.target_dungeon_character_name,
    this.target_dungeon_monster_name,
    this.target_dungeon_location_direction,
    this.target_dungeon_location_name,
  });
}

class DungeonLocation {
  final String name;
  final String description;
  final List<String> directions;

  DungeonLocation({required this.name, required this.description, required this.directions});
}
