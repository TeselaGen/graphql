get postgres

```
docker run --name postgres -e POSTGRES_DB=graphql_sequelize_test -e POSTGRES_USER=graphql_sequelize_test -e POSTGRES_PASSWORD=graphql_sequelize_test -p 5432:5432 -d postgres
```

run the server 
```
yarn install

yarn start

```

you can inspect the server at:
```
localhost:3001/graphql
```