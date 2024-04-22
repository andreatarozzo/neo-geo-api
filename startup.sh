#!/bin/sh

echo "Waiting for DB container with HOST:${DB_HOST} PORT:${DB_PORT} to accept connections..."

# This command checks if the target database host is ready to accept connections.
# It waits for 1 second before retrying if the connection is not yet available.
# This is particularly useful when running this kind of services with docker-compose because the database container
# might pass health checks but still be in its initializing state, preventing it from accepting connections
# and so making the node application fail its DB connection check.
max_retries=60
retries=0
while ! nc -z ${DB_HOST} ${DB_PORT}; do
 retries=$((retries+1))
 if [ $retries -ge $max_retries ]; then
    echo "Failed to connect to the database after $max_retries attempts."
    exit 1
 fi
 echo "Connection attempt $retries failed. Retrying in 1 second..."
 sleep 1
done

echo "DB container is ready!"

if [ "$NODE_ENV" = "production" ]; then
  # In production we assume that the DB is already created and 
  # we would eventually just trigger a migration if any ( handled by sequelize )
  npx sequelize-cli db:migrate
else
  # In test and development env we would like also to try to create the DB if not exists
  # and seed the db if it is not already filled with something ( logic in the seeder script )
  # This because we could be running the docker-compose command for the first time
  # meaning that no volume was previously present for the DB and so the postgres instance would be empty.
  npx sequelize-cli db:create
  npx sequelize-cli db:migrate
  npx sequelize-cli db:seed:all
fi

yarn start
