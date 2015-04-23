import Sequelize = require('sequelize');

import _Invariants = require('./invariants');
import _PromiseAdapter = require("./promise_adapter");

module ReCalLib {
    export var Invariants = _Invariants;
    export var PromiseAdapter = _PromiseAdapter;

    export module Interfaces {
        export interface DatabaseProxy {
            sequelize: Sequelize.Sequelize;
            Task?: Sequelize.Model<any, any>;
            TaskInfo?: Sequelize.Model<any, any>;
            TaskGroup?: Sequelize.Model<any, any>;
            User?: Sequelize.Model<any, any>;
        }
    }
}

export = ReCalLib;
