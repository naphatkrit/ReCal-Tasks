# ReCal-Tasks

## Migrations
### Running Migration
Initialize an empty database, then run this command (do **not** try to run `sync()` on the `sequelize` object itself.).

```
./node_modules/.bin/sequelize db:migrate
```

### Rolling Back Migrations

Run the command:

```
./node_modules/.bin/sequelize db:migrate:undo
```

### More Info
See [here](http://docs.sequelizejs.com/en/latest/docs/migrations/).
