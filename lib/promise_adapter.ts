import Q = require("q");
import mongoose = require('mongoose');

module PromiseAdapter
{
    // export function convertSequelize<T>(promise: Sequelize.PromiseT<T>): Q.Promise<T>
    // {
    //     let deferred = Q.defer<T>();
    //     promise.then(
    //         (success) =>
    //         {
    //             deferred.resolve(success);
    //         },
    //         (error) =>
    //         {
    //             deferred.reject(error);
    //         });
    //     return deferred.promise;
    // }
    export function convertMongooseQuery<T>(query: mongoose.Query<T>): Q.Promise<T> {
        let deferred = Q.defer<T>();
        query.exec((err, doc)=>{
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(doc);
            }
        })
        return deferred.promise;
    }
}

export = PromiseAdapter;
