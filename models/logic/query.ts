import Q = require('q');
import mongoose = require('mongoose');

import PromiseAdapter = require("../../lib/promise_adapter");

export function findOrCreate(model, criteria): Q.Promise<mongoose.Document>
{
    return PromiseAdapter.convertMongooseQuery<mongoose.Document>(model.findOne(criteria)).then(
        (doc) =>
        {
            if (!doc)
            {
                doc = new model(criteria);
            }
            doc.save();
            return doc;
        },
        (err) =>
        {
            let doc = new model(criteria);
            doc.save();
            return doc;
        })
}
