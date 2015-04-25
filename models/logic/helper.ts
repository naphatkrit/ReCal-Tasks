import Q = require('q');
import mongoose = require('mongoose');

import ReCalLib = require("../../lib/lib");

export function findOrCreate(model, criteria): Q.Promise<mongoose.Document>
{
    return ReCalLib.PromiseAdapter.convertMongooseQuery<mongoose.Document>(model.findOne(criteria)).then(
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
        }
        )
}
