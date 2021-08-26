-- pgcrypto
CREATE EXTENSION pgcrypto;

-- table dungeon
CREATE TABLE "dungeon" (
  "id"                    uuid CONSTRAINT dungeon_pk PRIMARY KEY DEFAULT gen_random_uuid(),
  "name"                  text NOT NULL,
  "description"           text NOT NULL,
  "created_at"            timestamp WITH TIME ZONE NOT NULL DEFAULT (current_timestamp),
  "updated_at"            timestamp WITH TIME ZONE,
  "deleted_at"            timestamp WITH TIME ZONE
);

-- table dungeon_location
CREATE TABLE "dungeon_location" (
  "id"                            uuid CONSTRAINT dungeon_location_pk PRIMARY KEY DEFAULT gen_random_uuid(),
  "dungeon_id"                    uuid NOT NULL,
  "name"                          text NOT NULL,
  "description"                   text NOT NULL,
  "default"                       boolean NOT NULL DEFAULT FALSE,
  "north_dungeon_location_id"     uuid,
  "northeast_dungeon_location_id" uuid,
  "east_dungeon_location_id"      uuid,
  "southeast_dungeon_location_id" uuid,
  "south_dungeon_location_id"     uuid,
  "southwest_dungeon_location_id" uuid,
  "west_dungeon_location_id"      uuid,
  "northwest_dungeon_location_id" uuid,
  "up_dungeon_location_id"        uuid,
  "down_dungeon_location_id"      uuid,
  "created_at"                    timestamp WITH TIME ZONE NOT NULL DEFAULT (current_timestamp),
  "updated_at"                    timestamp WITH TIME ZONE,
  "deleted_at"                    timestamp WITH TIME ZONE,
  CONSTRAINT dungeon_location_dungeon_id_fk FOREIGN KEY (dungeon_id) REFERENCES dungeon(id),
  CONSTRAINT dungeon_location_north_location_id_fk FOREIGN KEY (north_dungeon_location_id) REFERENCES dungeon_location(id) INITIALLY DEFERRED,
  CONSTRAINT dungeon_location_northeast_location_id_fk FOREIGN KEY (northeast_dungeon_location_id) REFERENCES dungeon_location(id) INITIALLY DEFERRED,
  CONSTRAINT dungeon_location_east_location_id_fk FOREIGN KEY (east_dungeon_location_id) REFERENCES dungeon_location(id) INITIALLY DEFERRED,
  CONSTRAINT dungeon_location_southeast_location_id_fk FOREIGN KEY (southeast_dungeon_location_id) REFERENCES dungeon_location(id) INITIALLY DEFERRED,
  CONSTRAINT dungeon_location_south_location_id_fk FOREIGN KEY (south_dungeon_location_id) REFERENCES dungeon_location(id) INITIALLY DEFERRED,
  CONSTRAINT dungeon_location_southwest_location_id_fk FOREIGN KEY (southwest_dungeon_location_id) REFERENCES dungeon_location(id) INITIALLY DEFERRED,
  CONSTRAINT dungeon_location_west_location_id_fk FOREIGN KEY (west_dungeon_location_id) REFERENCES dungeon_location(id) INITIALLY DEFERRED,
  CONSTRAINT dungeon_location_northwest_location_id_fk FOREIGN KEY (northwest_dungeon_location_id) REFERENCES dungeon_location(id) INITIALLY DEFERRED,
  CONSTRAINT dungeon_location_up_location_id_fk FOREIGN KEY (up_dungeon_location_id) REFERENCES dungeon_location(id) INITIALLY DEFERRED,
  CONSTRAINT dungeon_location_down_location_id_fk FOREIGN KEY (down_dungeon_location_id) REFERENCES dungeon_location(id) INITIALLY DEFERRED
);

-- table dungeon_character
CREATE TABLE "dungeon_character" (
  "id"                   uuid CONSTRAINT dungeon_character_pk PRIMARY KEY DEFAULT gen_random_uuid(),
  "dungeon_id"           uuid NOT NULL,
  "dungeon_location_id"  uuid NOT NULL,
  "name"                 text NOT NULL,
  "strength"             integer NOT NULL DEFAULT 10,
  "dexterity"            integer NOT NULL DEFAULT 10,
  "intelligence"         integer NOT NULL DEFAULT 10,
  "health"               integer NOT NULL DEFAULT 0,
  "fatigue"              integer NOT NULL DEFAULT 0,
  "coins"                integer NOT NULL DEFAULT 0,
  "experience_points"    integer NOT NULL DEFAULT 0,
  "attribute_points"     integer NOT NULL DEFAULT 0,
  "created_at"           timestamp WITH TIME ZONE NOT NULL DEFAULT (current_timestamp),
  "updated_at"           timestamp WITH TIME ZONE,
  "deleted_at"           timestamp WITH TIME ZONE,
  CONSTRAINT "dungeon_character_dungeon_id_fk" FOREIGN KEY (dungeon_id) REFERENCES dungeon(id),
  CONSTRAINT "dungeon_character_dungeon_location_id_fk" FOREIGN KEY (dungeon_location_id) REFERENCES dungeon_location(id)
);

-- table dungeon_monster
CREATE TABLE "dungeon_monster" (
  "id"                   uuid CONSTRAINT dungeon_monster_pk PRIMARY KEY DEFAULT gen_random_uuid(),
  "dungeon_id"           uuid NOT NULL,
  "dungeon_location_id"  uuid NOT NULL,
  "name"                 text NOT NULL,
  "strength"             integer NOT NULL DEFAULT 10,
  "dexterity"            integer NOT NULL DEFAULT 10,
  "intelligence"         integer NOT NULL DEFAULT 10,
  "health"               integer NOT NULL DEFAULT 0,
  "fatigue"              integer NOT NULL DEFAULT 0,
  "coins"                integer NOT NULL DEFAULT 0,
  "created_at"           timestamp WITH TIME ZONE NOT NULL DEFAULT (current_timestamp),
  "updated_at"           timestamp WITH TIME ZONE,
  "deleted_at"           timestamp WITH TIME ZONE,
  CONSTRAINT "dungeon_monster_dungeon_id_fk" FOREIGN KEY (dungeon_id) REFERENCES dungeon(id),
  CONSTRAINT "dungeon_monster_dungeon_location_id_fk" FOREIGN KEY (dungeon_location_id) REFERENCES dungeon_location(id)
);

-- table dungeon_object
CREATE TABLE "dungeon_object" (
  "id"                   uuid CONSTRAINT dungeon_object_pk PRIMARY KEY DEFAULT gen_random_uuid(),
  "dungeon_id"           uuid NOT NULL,
  "dungeon_location_id"  uuid NOT NULL,
  "dungeon_character_id" uuid NOT NULL,
  "dungeon_monster_id"   uuid NOT NULL,
  "name"                 text NOT NULL UNIQUE,
  "description_short"    text NOT NULL,
  "description_long"     text NOT NULL,
  "is_stashed"           boolean NOT NULL DEFAULT false,
  "is_equipped"          boolean NOT NULL DEFAULT false,
  "created_at"           timestamp WITH TIME ZONE NOT NULL DEFAULT (current_timestamp),
  "updated_at"           timestamp WITH TIME ZONE,
  "deleted_at"           timestamp WITH TIME ZONE,
  CONSTRAINT "dungeon_object_dungeon_id_fk" FOREIGN KEY (dungeon_id) REFERENCES dungeon(id),
  CONSTRAINT "dungeon_object_dungeon_location_id_fk" FOREIGN KEY (dungeon_location_id) REFERENCES dungeon_location(id),
  CONSTRAINT "dungeon_object_dungeon_character_id_fk" FOREIGN KEY (dungeon_character_id) REFERENCES dungeon_character(id),
  CONSTRAINT "dungeon_object_dungeon_monster_id_fk" FOREIGN KEY (dungeon_monster_id) REFERENCES dungeon_monster(id),
  CONSTRAINT "dungeon_object_location_character_monster_ck" CHECK (
    num_nonnulls(dungeon_location_id, dungeon_character_id, dungeon_monster_id) = 1
  )
);

-- table dungeon_character_action
CREATE TABLE "dungeon_character_action" (
  "id"                                uuid CONSTRAINT dungeon_character_action_pk PRIMARY KEY DEFAULT gen_random_uuid(),
  "dungeon_id"                        uuid NOT NULL,
  "dungeon_location_id"               uuid NOT NULL,
  "dungeon_character_id"              uuid NOT NULL,
  "serial_id"                         SERIAL,
  "command"                           text NOT NULL,
  "equipped_dungeon_object_name"      text,
  "equipped_dungeon_object_id"        uuid,
  "stashed_dungeon_object_name"       text,
  "stashed_dungeon_object_id"         uuid,
  "target_dungeon_object_name"        text,
  "target_dungeon_object_id"          uuid,
  "target_dungeon_character_name"     text,
  "target_dungeon_character_id"       uuid,
  "target_dungeon_monster_name"       text,
  "target_dungeon_monster_id"         uuid,
  "target_dungeon_location_direction" text,
  "target_dungeon_location_name"      text,
  "target_dungeon_location_id"        uuid,
  "created_at"                        timestamp WITH TIME ZONE NOT NULL DEFAULT (current_timestamp),
  "updated_at"                        timestamp WITH TIME ZONE,
  "deleted_at"                        timestamp WITH TIME ZONE,
  CONSTRAINT "dungeon_character_action_dungeon_id_fk" FOREIGN KEY (dungeon_id) REFERENCES dungeon(id),
  CONSTRAINT "dungeon_character_action_dungeon_location_id_fk" FOREIGN KEY (dungeon_location_id) REFERENCES dungeon_location(id),
  CONSTRAINT "dungeon_character_action_dungeon_character_id_fk" FOREIGN KEY (dungeon_character_id) REFERENCES dungeon_character(id),
  CONSTRAINT "dungeon_character_action_equipped_dungeon_object_id_fk" FOREIGN KEY (equipped_dungeon_object_id) REFERENCES dungeon_object(id),
  CONSTRAINT "dungeon_character_action_stashed_dungeon_object_id_fk" FOREIGN KEY (stashed_dungeon_object_id) REFERENCES dungeon_object(id),
  CONSTRAINT "dungeon_character_action_target_dungeon_object_id_fk" FOREIGN KEY (target_dungeon_object_id) REFERENCES dungeon_object(id),
  CONSTRAINT "dungeon_character_action_target_dungeon_character_id_fk" FOREIGN KEY (target_dungeon_character_id) REFERENCES dungeon_character(id),
  CONSTRAINT "dungeon_character_action_target_dungeon_monster_id_fk" FOREIGN KEY (target_dungeon_monster_id) REFERENCES dungeon_monster(id),
  CONSTRAINT "dungeon_character_action_target_dungeon_location_id_fk" FOREIGN KEY (target_dungeon_location_id) REFERENCES dungeon_location(id),
  CONSTRAINT "dungeon_character_action_target_id_ck" CHECK (
    num_nonnulls(target_dungeon_object_id, target_dungeon_character_id, target_dungeon_monster_id, target_dungeon_location_id) = 1
  ),
  CONSTRAINT "dungeon_character_action_target_name_ck" CHECK (
    num_nonnulls(target_dungeon_object_name, target_dungeon_character_name, target_dungeon_monster_name, target_dungeon_location_name) = 1
  )
);

-- table dungeon_monster_action
CREATE TABLE "dungeon_monster_action" (
  "id"                                uuid CONSTRAINT dungeon_monster_action_pk PRIMARY KEY DEFAULT gen_random_uuid(),
  "dungeon_id"                        uuid NOT NULL,
  "dungeon_location_id"               uuid NOT NULL,
  "dungeon_monster_id"                uuid NOT NULL,
  "serial_id"                         SERIAL,
  "command"                           text NOT NULL,
  "equipped_dungeon_object_name"      text,
  "equipped_dungeon_object_id"        uuid,
  "stashed_dungeon_object_name"       text,
  "stashed_dungeon_object_id"         uuid,
  "target_dungeon_object_name"        text,
  "target_dungeon_object_id"          uuid,
  "target_dungeon_character_name"     text,
  "target_dungeon_character_id"       uuid,
  "target_dungeon_monster_name"       text,
  "target_dungeon_monster_id"         uuid,
  "target_dungeon_location_direction" text,
  "target_dungeon_location_name"      text,
  "target_dungeon_location_id"        uuid,
  "created_at"                        timestamp WITH TIME ZONE NOT NULL DEFAULT (current_timestamp),
  "updated_at"                        timestamp WITH TIME ZONE,
  "deleted_at"                        timestamp WITH TIME ZONE,
  CONSTRAINT "dungeon_monster_action_dungeon_id_fk" FOREIGN KEY (dungeon_id) REFERENCES dungeon(id),
  CONSTRAINT "dungeon_monster_action_dungeon_location_id_fk" FOREIGN KEY (dungeon_location_id) REFERENCES dungeon_location(id),
  CONSTRAINT "dungeon_monster_action_dungeon_monster_id_fk" FOREIGN KEY (dungeon_monster_id) REFERENCES dungeon_monster(id),
  CONSTRAINT "dungeon_monster_action_equipped_dungeon_object_id_fk" FOREIGN KEY (equipped_dungeon_object_id) REFERENCES dungeon_object(id),
  CONSTRAINT "dungeon_monster_action_stashed_dungeon_object_id_fk" FOREIGN KEY (stashed_dungeon_object_id) REFERENCES dungeon_object(id),
  CONSTRAINT "dungeon_monster_action_target_dungeon_object_id_fk" FOREIGN KEY (target_dungeon_object_id) REFERENCES dungeon_object(id),
  CONSTRAINT "dungeon_monster_action_target_dungeon_character_id_fk" FOREIGN KEY (target_dungeon_character_id) REFERENCES dungeon_character(id),
  CONSTRAINT "dungeon_monster_action_target_dungeon_monster_id_fk" FOREIGN KEY (target_dungeon_monster_id) REFERENCES dungeon_monster(id),
  CONSTRAINT "dungeon_monster_action_target_dungeon_location_id_fk" FOREIGN KEY (target_dungeon_location_id) REFERENCES dungeon_location(id),
  CONSTRAINT "dungeon_monster_action_target_id_ck" CHECK (
    num_nonnulls(target_dungeon_object_id, target_dungeon_character_id, target_dungeon_monster_id, target_dungeon_location_id) = 1
  ),
  CONSTRAINT "dungeon_monster_action_target_name_ck" CHECK (
    num_nonnulls(target_dungeon_object_name, target_dungeon_character_name, target_dungeon_monster_name, target_dungeon_location_name) = 1
  )
);
