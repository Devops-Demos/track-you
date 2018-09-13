# Track-You

### Run Track-You Locally
```sh
docker-compose build postgresqldb
docker-compose up postgresqldb 
docker-compose build app_test
docker-compose up app_test
docker-compose build app
docker-compose up app
```
Then browse to localhost:4999. Use the following credentials to login.
```sh
ID: admin@test.com
Pwd: password
```

### Run Unit Tests
```sh
npm run test:unit
```

### Run Tests Only
```sh
docker-compose build postgresqldb
docker-compose up postgresqldb 
docker-compose build app_test
docker-compose up app_test
```

### Seed Data
When you run the tests, ```npm run migrate``` runs this command behind the sceen. This step seeds the database.

#testing
