module.exports = function (sequelize, DataTypes) {
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
            associate: function (models) {
                models.TaskInfo.hasMany(models.Task, { as: "tasks" });
            }
        },
        freezeTableName: true,
    });
};
