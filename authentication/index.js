var passport = require('passport');
var url = require('url');
var ModelLogic = require("../models/logic/index");
var Models = require('../models/index');
var ReCalLib = require("../lib/lib");
passport.use(new (require('passport-cas').Strategy)({
    ssoBaseURL: process.env.CAS_URL,
    passReqToCallback: true,
}, function (req, login, done) {
    ModelLogic.findOrCreate(Models.User.model, { _username: login }).then(function (user) {
        Models.User.invariants(user).then(function (invariants) {
            ReCalLib.Invariants.check(invariants);
            done(null, {
                userId: user.id
            });
        });
    });
}));
passport.serializeUser(function (user, done) {
    done(null, JSON.stringify(user));
});
passport.deserializeUser(function (userString, done) {
    done(null, JSON.parse(userString));
});
exports.initialize = function () {
    return passport.initialize();
};
exports.session = function () {
    return passport.session({
        pauseStream: true,
        failureRedirect: '/login'
    });
};
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}
exports.ensureAuthenticated = ensureAuthenticated;
function loginPage() {
    return passport.authenticate('cas', {
        successRedirect: '/'
    });
}
exports.loginPage = loginPage;
function logoutPage() {
    return function (req, res, next) {
        req.logout();
        var parsedURL = url.parse(req.url, true);
        delete parsedURL.query.ticket;
        delete parsedURL.search;
        var service = url.format({
            protocol: req.protocol || 'http',
            host: req.headers['host'],
            pathname: parsedURL.pathname,
            query: parsedURL.query
        });
        var casUrl = url.parse(process.env.CAS_URL);
        var casLogoutUrl = url.resolve(casUrl.href, casUrl.pathname + '/logout');
        res.redirect(casLogoutUrl + '?url=' + encodeURIComponent(service));
    };
}
exports.logoutPage = logoutPage;
