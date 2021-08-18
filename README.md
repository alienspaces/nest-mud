# Nest M.U.D

A M.U.D (multi user dungeon) with a back end API built with [`nestjs`](https://docs.nestjs.com/) and a front end UI built with [`Flutter`](https://flutter.dev/docs).

## Server

📝 _Look at what these scripts actually do before running them!_

### Setup

Attempts to install [`nvm`](https://github.com/nvm-sh/nvm), [`node`](https://nodejs.org/en/), [`yarn`](https://yarnpkg.com/), [`nestjs`](https://docs.nestjs.com/) and [`package.json`](./server/package.json) defined dependencies.

```bash
cd server
./script/setup
```

### Start

Starts a [`postgres`](https://www.postgresql.org/) database in a [`docker`](https://www.docker.com/) container, runs database migrations with [`db-migrate`](https://db-migrate.readthedocs.io/en/latest/) and starts the [`nestsjs`](https://docs.nestjs.com/) API server.

```bash
cd server
./script/start
```

## API

### Dungeons

```bash
# Get a list of dungeons
GET /api/v1/dungeons
```

### Characters

```bash
# Create a new character in a dungeon
POST /api/v1/dungeons/:dungeon_id/characters
```

### Locations

```bash
# Get a list of dungeon locations
GET /api/v1/dungeons/:dungeon_id/locations
```

### Actions

Actions, when successful, create an event log of a character exploration.

```bash
# Create a new action
POST /api/v1/dungeons/:dungeon_id/actions
```

Example of moving north from the characters current location.

### Request payload

All request resources are submitted within a `data` block.

```json
{
  "data": {
    "action": "north"
  }
}
```

### Response payload

All response resources are returned as an array of objects within the `data` block for consistency.

```json
{
    "data": [{
        "id": "879eb3c-b864-4e68-8cfe-2a584cf9502d",
        "action": "move",
        "character_id": "ec74726a-7c3c-40e3-8eac-0146d770b023",
        "location_id" : "b8c5bd07-fea9-4d91-95e6-d5cb01c31aad"
        ...
    }]
}
```

## TODO

Lots to do, lots to do..

- Complete services
- Implement move [location] action
- Implement look [object] action
- Implement equip [object], stash [object] and drop [object] actions

## Special Note

As I would much prefer to build the backend in Go, I am only going to build limited funtionality into version as a proof of concept and a means of learning nestjs/typescript.
