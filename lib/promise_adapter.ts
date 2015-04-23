import Q = require("q");
import Sequelize = require("sequelize");

module PromiseAdapter
{
    export function convertSequelize<T>(promise: Sequelize.PromiseT<T>): Q.Promise<T>
    {
        let deferred = Q.defer<T>();
        promise.then(
            (success) =>
            {
                deferred.resolve(success);
            },
            (error) =>
            {
                deferred.reject(error);
            });
        return deferred.promise;
    }
}

export = PromiseAdapter;
