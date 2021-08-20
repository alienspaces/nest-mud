# Nest M.U.D

A M.U.D (multi user dungeon) with a back end API built with [`nestjs`](https://docs.nestjs.com/) and a front end UI built with [`Flutter`](https://flutter.dev/docs).

[Getting Started](README.md)

## API

### Dungeons

**List dungeons:**

- [Response Schema](server/src/controllers/dungeon/schema/dungeon.schema.json)

```bash
GET /api/v1/dungeons
```

**Get a dungeon:**

- [Response Schema](server/src/controllers/dungeon/schema/dungeon.schema.json)

```bash
GET /api/v1/dungeons/{:dungeon_id}
```

### Characters

**Create a character:**

- [Request Scheme](server/src/controllers/dungeon-character/schema/create-dungeon-character.schema.json)
- [Response Scheme](server/src/controllers/dungeon-character/schema/dungeon-character.schema.json)

```bash
POST /api/v1/dungeons/{:dungeon_id}/characters
```

**Update a character:**

- [Request Scheme](server/src/controllers/dungeon-character/schema/update-dungeon-character.schema.json)
- [Response Scheme](server/src/controllers/dungeon-character/schema/dungeon-character.schema.json)

```bash
PUT /api/v1/dungeons/{:dungeon_id}/characters/{:character_id}
```

**Get a character:**

- [Response Scheme](server/src/controllers/dungeon-character/schema/dungeon-character.schema.json)

```bash
GET /api/v1/dungeons/{:dungeon_id}/characters/{:character_id}
```

### Locations

**List dungeon locations:**

- [Response Schema](server/src/controllers/dungeon-location/schema/dungeon-location.schema.json)

```bash
GET /api/v1/dungeons/{:dungeon_id}/locations
```

**Get a dungeon location:**

- [Response Schema](server/src/controllers/dungeon-location/schema/dungeon-location.schema.json)

```bash
GET /api/v1/dungeons/{:dungeon_id}/locations/{:location_id}
```

### Actions

Characters are controlled with actions that are simple sentences.

**Create an action:**

```bash
POST /api/v1/dungeons/{:dungeon_id}/actions
```

Example of moving north from the characters current location.

### Request payload

All request JSON data must be contained within a `data` block.

```json
{
  "data": {
    "action": "move north"
  }
}
```

### Response payload

All response JSON data is returned as an array of objects contained within the `data`.

```json
{
    "data": [{
        "id": "879eb3c-b864-4e68-8cfe-2a584cf9502d",
        "action": "move north",
        "character_id": "ec74726a-7c3c-40e3-8eac-0146d770b023",
        "location_id" : "b8c5bd07-fea9-4d91-95e6-d5cb01c31aad"
        ...
    }]
}
```
