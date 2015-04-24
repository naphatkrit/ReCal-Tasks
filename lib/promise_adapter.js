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
})(PromiseAdapter || (PromiseAdapter = {}));
module.exports = PromiseAdapter;
