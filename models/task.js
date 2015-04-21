var Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
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
};
