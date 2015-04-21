var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var url = require('url');
var routes = require('./routes/index');
var users = require('./routes/users');
passport.use(new (require('passport-cas').Strategy)({
    ssoBaseURL: process.env.CAS_URL,
}, function (login, done) {
    done(null, {
        username: login
    });
}));
passport.serializeUser(function (user, done) {
    done(null, user.username);
});
passport.deserializeUser(function (username, done) {
    done(null, {
        username: username,
    });
});
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/login', passport.authenticate('cas', {
    successRedirect: '/',
    failureRedirect: '/login'
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
app.use('/', passport.authenticate('cas'), routes);
app.use('/users', passport.authenticate('cas'), users);
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
