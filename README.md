# ReCal-Tasks

## Front-end

We use Angular as our client side framework. The code for the frontend is in the directory `./client`.

### Development

First ensure that you have Ruby and Compass installed. Compass is used for compiling Sass down to CSS.

Then, run `bower install` and `npm install` to install the dependencies.

Run `grunt test` to verify that everything is working.
Run `grunt serve` to serve the development environment.
Run `grunt --force` to compile the front-end code to `/ReCal-Tasks/server/public`.

## Back-end

We use Express as our server side framework. The code for backend is in the directory `./server/`.

### Development

Run `foreman start` to simulate a heroku environment.
Run `npm start` to use production settings and read from `./public/`
Run `npm test` to use development settings and read from `../client/`.

### Migrations
#### Running Migration
Initialize an empty database, then run this command (do **not** try to run `sync()` on the `sequelize` object itself.).

```
./node_modules/.bin/sequelize db:migrate
```

#### Rolling Back Migrations

Run the command:

```
./node_modules/.bin/sequelize db:migrate:undo
```

#### More Info
See [here](http://docs.sequelizejs.com/en/latest/docs/migrations/).
