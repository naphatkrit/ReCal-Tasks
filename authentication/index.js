var passport = require('passport');
var url = require('url');
passport.use(new (require('passport-cas').Strategy)({
    ssoBaseURL: process.env.CAS_URL,
    passReqToCallback: true,
}, function (req, login, done) {
    var ticket = req.query.ticket;
    if (ticket === null || ticket === undefined) {
        done(new Error('Invalid ticket'));
    }
    else {
        done(null, {
            username: login,
            ticket: ticket,
        });
    }
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
    console.log("Ensuring authentication");
    console.log(req._passport);
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