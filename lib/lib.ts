import Sequelize = require('sequelize');

import _Invariants = require('./Invariants');

module ReCalLib {
    export var Invariants = _Invariants;

    export module Interfaces {
        export interface DatabaseProxy {
            sequelize: Sequelize.Sequelize;
            Task?: Sequelize.Model<any, any>;
            TaskInfo?: Sequelize.Model<any, any>;
        }
    }
}

export = ReCalLib;
