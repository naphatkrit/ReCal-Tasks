import Sequelize = require('sequelize');

export = function(sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes) {
    return sequelize.define('Task', {
    });
}
