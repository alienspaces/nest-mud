#!/usr/bin/env bash

COMMAND=$(shift)

echo "COMMAND => $COMMAND";

# environment
# shellcheck disable=SC1091
source "script/environment" || exit $?

# Retry
# shellcheck disable=SC1091
source "script/retry" || exit $?

export POSTGRES_DB=$APP_SERVER_DB_NAME
export POSTGRES_USER=$APP_SERVER_DB_USER
export POSTGRES_PASSWORD=$APP_SERVER_DB_PASSWORD

# Run postgres entrypoint
/usr/local/bin/docker-entrypoint.sh postgres &

# Override provided environment database host
export APP_SERVER_DB_HOST="localhost"
export APP_SERVER_DB_PORT=5432

# Wait for connection to be available
# shellcheck disable=SC2153
export PGPASSWORD="$APP_SERVER_DB_PASSWORD"
retry_cmd psql --host="$APP_SERVER_DB_HOST" \
     --port="$APP_SERVER_DB_PORT" \
	 --username="$APP_SERVER_DB_USER" \
     --command="SELECT 1" \
     "$APP_SERVER_DB_NAME"

# shellcheck disable=SC1091
source "script/db-migrate-up" || exit $?

# shellcheck disable=SC1091
source "script/db-seed" || exit $?

# Start API server
yarn start
