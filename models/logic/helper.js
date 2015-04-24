var ReCalLib = require("../../lib/lib");
function findOrCreate(model, criteria) {
    return ReCalLib.PromiseAdapter.convertMongooseQuery(model.findOne(criteria)).then(function (doc) {
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
