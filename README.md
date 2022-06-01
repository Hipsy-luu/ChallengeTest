<p align="center">
  <a target="blank"><img src="https://i.imgur.com/2kafY1n.jpg" width="320" alt="System Lgin" /></a>
</p>

## Description

[Challenge](https://github.com/Hipsy-luu/ChallengeTest) for tecnical knowloge evaluation repository.

## Test User Credentials

- user - 'benito.testito@gmail.com'
- pass - '50YujDBiAF6NNOEx'

## Database for test suplyed in

-/dev_utils/movementsTracker.sql

## Coverage Report details of test in

-/coverage-report/index.html

<p align="center">
  <a target="blank"><img src="https://i.imgur.com/jsyO8ux.jpg" width="320" alt="System Lgin" /></a>
</p>


# Docker

## Installation by docker compose

```bash
$ docker-compose up -d --build client-angular-ui
```

## Considerations
For docker integration we need to change the DATABASE_HOST variable in 
api_server/src/database/database.providers.ts file
from host:'localhost' to host:'mysqldb-app'.

<p align="center">
  <a target="blank"><img src="https://i.imgur.com/1BsWuyv.jpg" width="320" alt="System Lgin" /></a>
</p>mysqldb-app

<p align="center">
  <a target="blank"><img src="https://i.imgur.com/udAIRwW.jpg" width="320" alt="System Lgin" /></a>
</p>

The dockerfile deletes the database every time it is run.

We need to have the ports 4200 and 3000 free in local and docker develoment .


# ApiProyect

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

# WebProyect

## Development server

## Running the app
```bash
# unit tests
$ bash ng serve -o
```

## Build

Run  
```bash
# unit tests
$ ng build
```
 to build the project. The build artifacts will be stored in the `dist/` directory.

## Stay in touch

- Author - [Luismiguel Ortiz Alvarez](https://www.facebook.com/Luismi.luu/)
- GitHub - [https://github.com/Hipsy-luu](https://github.com/Hipsy-luu)


## License

  Nest is [MIT licensed](LICENSE).