# Nest M.U.D

A M.U.D (multi user dungeon) with a back end API built with nestjs and a front end UI built with Flutter.

## Server

📝 _Look at what these scripts actually do before running them!_

### Setup

Attempts to install `nvm`, `node`, `yarn`, `nestjs` and `package.json` defined dependencies.

```bash
cd server
./script/setup
```

### Start

Starts a `postgres` database in a `docker` container, runs database migrations with `db-migrate` and starts the `nestsjs` API server.

```bash
cd server
./script/start
```
