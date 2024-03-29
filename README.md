# Nest M.U.D - Getting Started

- [Getting Started](README.md)
- [How to Play](README-HOWTOPLAY.md)
- [API](README-API.md)
- [Design](README-DESIGN.md)

A M.U.D (multi user dungeon) with a back end API built with [`nestjs`](https://docs.nestjs.com/) and a front end UI built with [`Flutter`](https://flutter.dev/docs).

❗ Project Complete ~ October 3rd 2021 ❗

Only a small subset of features has been implemented to demonstrate as a proof of concept.

Follow the next iteration in the [Go M.U.D](https://gitlab.com/alienspaces/go-mud) repository.

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

Generate client configuration code.

```bash
cd client
./script/start
```

Use your favourite Flutter project IDE and Android/iOS emulator.

## Special Note

As I would much prefer to build the backend in [`Go`](https://golang.org/doc/tutorial/getting-started), I chose to build limited funtionality into this version as a proof of concept and a means of learning something about [`nestjs`](https://docs.nestjs.com/) and [`TypeScript`](https://www.typescriptlang.org/docs/).
