import Sequelize = require('sequelize');

import _Invariants = require('./Invariants');

module ReCalLib {
    export var Invariants = _Invariants;

    export interface DatabaseProxy {
        sequelize: Sequelize.Sequelize;
        Task?: Sequelize.Model<any, any>;
    }
}

export = ReCalLib;
