module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Task', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        status: {
            type: DataTypes.ENUM,
            values: ["complete", "incomplete"],
            defaultValue: "incomplete"
        }
    }, {
        classMethods: {
            associate: function (models) {
                models.Task.belongsTo(models.TaskInfo);
            }
        }
    });
};
