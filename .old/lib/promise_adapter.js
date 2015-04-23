var Q = require("q");
var PromiseAdapter;
(function (PromiseAdapter) {
    function convertSequelize(promise) {
        var deferred = Q.defer();
        promise.then(function (success) {
            deferred.resolve(success);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }
    PromiseAdapter.convertSequelize = convertSequelize;
})(PromiseAdapter || (PromiseAdapter = {}));
module.exports = PromiseAdapter;
