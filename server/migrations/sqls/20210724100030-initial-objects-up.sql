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
  "coin"                 integer NOT NULL DEFAULT 0,
  "experience"           integer NOT NULL DEFAULT 0,
  "created_at"           timestamp WITH TIME ZONE NOT NULL DEFAULT (current_timestamp),
  "updated_at"           timestamp WITH TIME ZONE,
  "deleted_at"           timestamp WITH TIME ZONE,
  CONSTRAINT "dungeon_character_dungeon_id_fk" FOREIGN KEY (dungeon_id) REFERENCES dungeon(id),
  CONSTRAINT "dungeon_character_dungeon_location_id_fk" FOREIGN KEY (dungeon_location_id) REFERENCES dungeon_location(id)
);

-- table dungeon_character_action
CREATE TABLE "dungeon_character_action" (
  "id"                   uuid CONSTRAINT dungeon_character_action_pk PRIMARY KEY DEFAULT gen_random_uuid(),
  "dungeon_id"           uuid NOT NULL,
  "dungeon_location_id"  uuid NOT NULL,
  "dungeon_character_id" uuid NOT NULL,
  "serial_id"            SERIAL,
  "action"               text NOT NULL,
  "action_target"        text NOT NULL,
  "action_result"        text NOT NULL,
  "created_at"           timestamp WITH TIME ZONE NOT NULL DEFAULT (current_timestamp),
  "updated_at"           timestamp WITH TIME ZONE,
  "deleted_at"           timestamp WITH TIME ZONE,
  CONSTRAINT "dungeon_character_action_dungeon_id_fk" FOREIGN KEY (dungeon_id) REFERENCES dungeon(id),
  CONSTRAINT "dungeon_character_action_dungeon_location_id_fk" FOREIGN KEY (dungeon_location_id) REFERENCES dungeon_location(id),
  CONSTRAINT "dungeon_character_action_dungeon_character_id_fk" FOREIGN KEY (dungeon_character_id) REFERENCES dungeon_character(id)
);

