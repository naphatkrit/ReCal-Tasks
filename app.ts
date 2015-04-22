import express = require('express');
import path = require('path');
import favicon = require('serve-favicon');
import logger = require('morgan');
import cookieParser = require('cookie-parser');
import bodyParser = require('body-parser');
import passport = require('passport');
import session = require('express-session');
import url = require('url');

import routes = require('./routes/index');
import users = require('./routes/users');

// passport.use();
passport.use(new (require('passport-cas').Strategy)({
  ssoBaseURL: process.env.CAS_URL,
  passReqToCallback: true,
}, function(req, login, done) {
    let ticket = req.query.ticket;
    if (ticket === null || ticket === undefined) {
        done(new Error('Invalid ticket'));
    } else {
        done(null, {
            username: login,
            ticket: ticket,
        });
    }

}));

// TODO replace with actual implementation once we have a user object
passport.serializeUser(function(user, done) {
    done(null, JSON.stringify(user));
});

passport.deserializeUser(function(userString, done) {
    done(null, JSON.parse(userString))
})

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
    console.log("Ensuring authentication");
    console.log(req._passport);
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// TODO uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(session({
    secret: "ReCal Secret"
})); // if we use this, put it before passport
app.use(passport.initialize());
app.use(passport.session({
    pauseStream: true,
    failureRedirect: '/login'
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/login', passport.authenticate('cas', {
    successRedirect: '/'
}))
app.use('/logout', function(req, res, next) {
    req.logout();
    let parsedURL = url.parse(req.url, true);
    delete parsedURL.query.ticket;
    delete parsedURL.search;
    let service = url.format({
        protocol: req.protocol || 'http',
        host: req.headers['host'],
        pathname: parsedURL.pathname,
        query: parsedURL.query
    })
    let casUrl = url.parse(process.env.CAS_URL)
    let casLogoutUrl = url.resolve(casUrl.href, casUrl.pathname + '/logout');
    res.redirect(casLogoutUrl + '?url=' + encodeURIComponent(service));
})
app.use('/', ensureAuthenticated, routes);
app.use('/users', ensureAuthenticated, users);

// catch 404 and forward to error handler
app.use((req, res, next) =>
{
    var err: any = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development')
{
    app.use(<(express.ErrorRequestHandler) > function(err, req, res, next)
    {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        })
    });
}

// production error handler
// no stacktraces leaked to user
app.use(<(express.ErrorRequestHandler) > function(err, req, res, next)
{
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

export = app;
