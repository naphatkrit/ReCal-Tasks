import Sequelize = require('sequelize');

export = function(sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes)
{
    return sequelize.define('Task', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        status: {
            type: Sequelize.ENUM,
            values: ["complete", "incomplete"],
            allowNull: false,
            defaultValue: "incomplete"
        }
    });
}
