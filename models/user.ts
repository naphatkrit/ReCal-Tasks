import Sequelize = require('sequelize');
import ReCalLib = require("../lib/lib");

export = function(sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes)
{
    return sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING
        }
    }, {
        classMethods: {
            associate: function(models: ReCalLib.Interfaces.DatabaseProxy) {
                models.User.hasMany(models.Task);
            }
        }
    });
}
