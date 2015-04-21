import express = require('express');
import path = require('path');
import favicon = require('serve-favicon');
import logger = require('morgan');
import cookieParser = require('cookie-parser');
import bodyParser = require('body-parser');
import passport = require('passport');
import url = require('url');

import routes = require('./routes/index');
import users = require('./routes/users');

// passport.use();
passport.use(new (require('passport-cas').Strategy)({
  ssoBaseURL: process.env.CAS_URL,
}, function(login, done) {
    done(null, {
        username: login
    });
}));

// TODO replace with actual implementation once we have a user object
passport.serializeUser(function(user, done) {
    done(null, user.username);
});

passport.deserializeUser(function(username, done) {
    done(null, {
        username: username,
    })
})

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
// app.use(express.session()); // if we use this, put it before passport
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/login', passport.authenticate('cas', {
    successRedirect: '/',
    failureRedirect: '/login'
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
app.use('/', passport.authenticate('cas'), routes);
app.use('/users', passport.authenticate('cas'), users);

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
