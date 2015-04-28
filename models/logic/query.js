var PromiseAdapter = require("../../lib/promise_adapter");
function findOrCreate(model, criteria) {
    return PromiseAdapter.convertMongooseQuery(model.findOne(criteria)).then(function (doc) {
        if (!doc) {
            doc = new model(criteria);
        }
        doc.save();
        return doc;
    }, function (err) {
        var doc = new model(criteria);
        doc.save();
        return doc;
    });
}
exports.findOrCreate = findOrCreate;
