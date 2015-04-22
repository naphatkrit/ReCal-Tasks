module.exports = function (sequelize, DataTypes) {
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
            associate: function (models) {
                models.User.hasMany(models.Task);
            }
        }
    });
};
