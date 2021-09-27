# Nest M.U.D - Getting Started

- [Getting Started](README.md)
- [How to Play](README-HOWTOPLAY.md)
- [API](README-API.md)
- [Design](README-DESIGN.md)

A M.U.D (multi user dungeon) with a back end API built with [`nestjs`](https://docs.nestjs.com/) and a front end UI built with [`Flutter`](https://flutter.dev/docs).

## Server

📝 _Look at what these scripts actually do before running them!_

### Setup

Attempts to install [`nvm`](https://github.com/nvm-sh/nvm), [`node`](https://nodejs.org/en/), [`yarn`](https://yarnpkg.com/), [`nestjs`](https://docs.nestjs.com/) and [`package.json`](./server/package.json) defined dependencies.

```bash
cd server
./script/setup
```

### Start Server

Starts a [`postgres`](https://www.postgresql.org/) database in a [`docker`](https://www.docker.com/) container, runs database migrations with [`db-migrate`](https://db-migrate.readthedocs.io/en/latest/), loads game data and starts the [`nestsjs`](https://docs.nestjs.com/) API server.

```bash
cd server
./script/start
```

### Start Client

```bash
cd client
./script/start
```

## TODO

- API functions need to return something from all functions
  that can be interpreted as an error. Possibly return `{ status: int, data: JSON string, error: string }`.
- UI improvements round 1
  - Character Play Screen
  - Game screen
- Error handling
  - Duplicate character name
- Enlarge dungeon
- Add more dungeon objects
- Add more dungeon monsters
- UI improvements round 2
  - Show dungeon objects and monsters
- Complete 'look' action
- UI improvements round 3
  - Add look buttons
- Run with `docker-compose up`
- Update documentation to represent what is supported

End of scope for this specific proof of concept

## Special Note

As I would much prefer to build the backend in [`Go`](https://golang.org/doc/tutorial/getting-started), I am only going to build limited funtionality into this version as a proof of concept and a means of learning something about [`nestjs`](https://docs.nestjs.com/) and [`TypeScript`](https://www.typescriptlang.org/docs/).
