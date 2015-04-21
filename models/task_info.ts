import Sequelize = require('sequelize');
import ReCalLib = require("../lib/lib");

export = function(sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes)
{
    return sequelize.define('TaskInfo', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        title: {
            type: DataTypes.TEXT,
            values: ["complete", "incomplete"],
            allowNull: false,
            defaultValue: "incomplete"
        },
    }, {
        classMethods: {
            associate: function(models: ReCalLib.Interfaces.DatabaseProxy) {
                // this generates a foreign key on models.Task
                models.TaskInfo.hasMany(models.Task, {as: "tasks"});
            }
        },
        freezeTableName: true, // prevent sequelize from naming the table TaskInfos instead of TaskInfo
    });
}
