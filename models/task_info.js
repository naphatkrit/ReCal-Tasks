module.exports = function (sequelize, DataTypes) {
    return sequelize.define('TaskInfo', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.TEXT,
            values: ["complete", "incomplete"],
            defaultValue: "incomplete"
        },
    }, {
        getterMethods: {
            createdAt: function () {
                return this.getDataValue("createdAt");
            },
            updatedAt: function () {
                return this.getDataValue("updatedAt");
            },
        },
        classMethods: {
            associate: function (models) {
                models.TaskInfo.hasMany(models.Task);
                models.TaskInfo.belongsTo(models.TaskInfo, { as: "PreviousVersion" });
            }
        },
        freezeTableName: true,
        validate: {
            isImmutable: function () {
                if (this.createdAt != this.updatedAt) {
                    throw new Error("TaskInfo is immutable.");
                }
            }
        }
    });
};
