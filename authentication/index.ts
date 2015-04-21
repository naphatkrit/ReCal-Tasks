import xcas = require('xcas');
import express = require('express');
var router = express.Router();

let cas = new xcas({
    base_url: process.env.CAS_URL, // TODO put this in env variable
    version: 2.0,
});

router.get('/', function(req, res, next) {
    cas.authenticate(req, res, function(err, status, username, extended) {
        if (err) {
          // Handle the error
          res.send({error: err});
        } else {
          // Log the user in
          next();
        }
    })
});

export = router;
