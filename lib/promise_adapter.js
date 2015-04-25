var Q = require("q");
var PromiseAdapter;
(function (PromiseAdapter) {
    function convertMongooseQuery(query) {
        var deferred = Q.defer();
        query.exec(function (err, doc) {
            if (err) {
                deferred.reject(err);
            }
            else {
                deferred.resolve(doc);
            }
        });
        return deferred.promise;
    }
    PromiseAdapter.convertMongooseQuery = convertMongooseQuery;
    function convertMongoosePromise(promise) {
        var deferred = Q.defer();
        promise.then(function (success) {
            deferred.resolve(success);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }
    PromiseAdapter.convertMongoosePromise = convertMongoosePromise;
})(PromiseAdapter || (PromiseAdapter = {}));
module.exports = PromiseAdapter;
