-- pgcrypto
CREATE EXTENSION pgcrypto;

-- table location
CREATE TABLE "location" (
  "id"           uuid CONSTRAINT location_pk PRIMARY KEY DEFAULT gen_random_uuid(),
  "name"         text NOT NULL,
  "description"  text NOT NULL,
  "default"      boolean NOT NULL DEFAULT FALSE,
  "north"        boolean NOT NULL DEFAULT FALSE,
  "northeast"    boolean NOT NULL DEFAULT FALSE,
  "east"         boolean NOT NULL DEFAULT FALSE,
  "southeast"    boolean NOT NULL DEFAULT FALSE,
  "south"        boolean NOT NULL DEFAULT FALSE,
  "southwest"    boolean NOT NULL DEFAULT FALSE,
  "west"         boolean NOT NULL DEFAULT FALSE,
  "northwest"    boolean NOT NULL DEFAULT FALSE,
  "up"           boolean NOT NULL DEFAULT FALSE,
  "down"         boolean NOT NULL DEFAULT FALSE,
  "created_at"   timestamp WITH TIME ZONE NOT NULL DEFAULT (current_timestamp),
  "updated_at"   timestamp WITH TIME ZONE,
  "deleted_at"   timestamp WITH TIME ZONE
);

-- table character
CREATE TABLE "character" (
  "id"           uuid CONSTRAINT character_pk PRIMARY KEY DEFAULT gen_random_uuid(),
  "location_id"  uuid NOT NULL,
  "name"         text NOT NULL,
  "strength"     integer NOT NULL DEFAULT 10,
  "dexterity"    integer NOT NULL DEFAULT 10,
  "intelligence" integer NOT NULL DEFAULT 10,
  "coin"         integer NOT NULL DEFAULT 0,
  "experience"   integer NOT NULL DEFAULT 0,
  "created_at"   timestamp WITH TIME ZONE NOT NULL DEFAULT (current_timestamp),
  "updated_at"   timestamp WITH TIME ZONE,
  "deleted_at"   timestamp WITH TIME ZONE
);

ALTER TABLE "character" ADD CONSTRAINT "character_location_id_fk" 
    FOREIGN KEY ("location_id") REFERENCES "location" ("id");
