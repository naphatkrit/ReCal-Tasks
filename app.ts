import express = require('express');
import path = require('path');
import favicon = require('serve-favicon');
import logger = require('morgan');
import cookieParser = require('cookie-parser');
import bodyParser = require('body-parser');
import session = require('express-session');

import authentication = require('./authentication/index');
import routes = require('./routes/index');
import api = require('./api/index');

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
}));
app.use(authentication.initialize());
app.use(authentication.session());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/login', authentication.loginPage());
app.use('/logout', authentication.logoutPage());
app.use('/api', authentication.ensureAuthenticated, api);
app.use('/', authentication.ensureAuthenticatedRedirect, routes);

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
