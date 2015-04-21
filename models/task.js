module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Task', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM,
            values: ["complete", "incomplete"],
            allowNull: false,
            defaultValue: "incomplete"
        }
    }, {
        classMethods: {
            associate: function (models) {
            }
        }
    });
};
