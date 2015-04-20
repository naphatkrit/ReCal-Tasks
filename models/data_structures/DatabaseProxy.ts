import Sequelize = require('sequelize');

interface DatabaseProxy {
    sequelize: Sequelize.Sequelize;
    Task?: Sequelize.Model<any, any>;
}

export = DatabaseProxy;
