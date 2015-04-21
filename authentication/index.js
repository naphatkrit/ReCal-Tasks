var xcas = require('xcas');
var express = require('express');
var router = express.Router();
var cas = new xcas({
    base_url: process.env.CAS_URL,
    version: 2.0,
});
router.get('/', function (req, res, next) {
    cas.authenticate(req, res, function (err, status, username, extended) {
        if (err) {
            res.send({ error: err });
        }
        else {
            next();
        }
    });
});
module.exports = router;
