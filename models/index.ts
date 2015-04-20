'use strict';

import fs = require('fs');
import path = require('path');
import Sequelize = require('sequelize');
import DatabaseProxy = require('data_structures/DatabaseProxy');

var basename = path.basename(module.filename);
var env = process.env.NODE_ENV || 'development';
var sequelize = new Sequelize(process.env.DATABASE_URL, {});
var db: DatabaseProxy = {
    sequelize: sequelize,
};

fs.readdirSync(__dirname).filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && path.extname(file) === ".js";
}).forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
});

Object.keys(db).forEach(function(modelName) {
    if (modelName === 'sequelize') {
        return;
    }
    if ('associate' in db[modelName]) {
        db[modelName].associate(db);
    }
});

export = db;
