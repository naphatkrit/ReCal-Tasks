var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var url = require('url');
var routes = require('./routes/index');
var users = require('./routes/users');
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
function ensureAuthenticated(req, res, next) {
    console.log("Ensuring authentication");
    console.log(req._passport);
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(session({
    secret: "ReCal Secret"
}));
app.use(passport.initialize());
app.use(passport.session({
    pauseStream: true,
    failureRedirect: '/login'
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/login', passport.authenticate('cas', {
    successRedirect: '/'
}));
app.use('/logout', function (req, res, next) {
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
});
app.use('/', ensureAuthenticated, routes);
app.use('/users', ensureAuthenticated, users);
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
module.exports = app;
