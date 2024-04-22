# node-geo-api-postgres

Node api interacting with a postgres database through sequelize.

## How to run the project

It is possible to run this project in 2 different ways, the preferred one is using docker-compose

### Docker-compose ( preferred )

```bash
docker-compose build && docker-compose up
```

This will spin up 2 containers one for the node project and a `postgis/postgis:16-3.4-alpine` postgres database.

On startup the node container will do the following through the `startup.sh` entrypoint:

- Try to check if the DB is actually reachable/can accept connection, waiting 1 second before retrying ( max 60 ) if the DB is not actually ready.
- Depending on the current `NODE_ENV` different actions will be taken

  - If the environment is `production` a sequelize migration will be attempted.
  - If the environment is `development` or `test` the script will try to create the DB, run the migration and seed the DB ( only if the table is empty )

- Run the `yarn start` command to actually start the server at port `3000`.

### Locally

It is possible to run the project also locally but some prep steps will be necessary to have everything set up correctly.

#### Requirements

You need to create a .env file at the root level of the project directory with the following variables defined.

```bash
PORT=3000
DB_CONNECTION_STRING=postgres://postgres:postgrespsw@localhost:5432/businesses
NODE_ENV=development
```

Also, you will need a `postgres` database with `postgis` enabled up and running before you proceed. <br>
You can use the following command to spin one up.

```bash
docker run -it -p 5432:5432 -e POSTGRES_PASSWORD=postgrespsw -e POSTGRES_USER=postgres -e POSTGRES_DB=businesses postgis/postgis:16-3.4-alpine
```

Postgres also will need to have the migrations executed and the seeding done.<br>

To do so you can do the following:

- Open the file `sequelize/config/config.json` and depending on the `NODE_ENV` variable set in your `.env` file modify the portion of the config associated to it by changing the value of the `host` property from `database` ( this is the host used while the project is running with docker-compose ) to `localhost`.

- Run the migration command `npx sequelize-cli db:migrate`
- Run the seeding command `npx sequelize-cli db:seed:all`

> **IMPORTANT** <br>
> If you choose to use this last option to run the project remember to change the sequelize config file back to its original form and so setting back the `host` property to `database` in case you plan to run the project through the docker-compose commands showed above.
