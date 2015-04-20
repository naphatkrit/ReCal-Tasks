var assert = require("assert");
var Invariants;
(function (Invariants) {
    var debug = Number(process.env.RECAL_DEBUG || "0") !== 0;
    Invariants.alwaysTrue = function () { return true; };
    Invariants.alwaysFalse = function () { return false; };
    function check(invariant) {
        if (debug) {
            assert(invariant());
        }
    }
    Invariants.check = check;
    function checkArray(invariants) {
        var combined = invariants.reduce(chain, Invariants.alwaysTrue);
        check(combined);
    }
    Invariants.checkArray = checkArray;
    function chain(invariant1, invariant2) {
        return function () { return invariant1() && invariant2(); };
    }
    Invariants.chain = chain;
    function notNullOrUndefined(item) {
        return function () { return item !== null && item !== undefined; };
    }
    Invariants.notNullOrUndefined = notNullOrUndefined;
})(Invariants || (Invariants = {}));
module.exports = Invariants;
