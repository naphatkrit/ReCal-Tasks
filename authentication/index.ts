import passport = require('passport');
import url = require('url');

passport.use(new (require('passport-cas').Strategy)({
    ssoBaseURL: process.env.CAS_URL,
    passReqToCallback: true,
}, function(req, login, done)
    {
        let ticket = req.query.ticket;
        if (ticket === null || ticket === undefined)
        {
            done(new Error('Invalid ticket'));
        } else
        {
            done(null, {
                username: login,
                ticket: ticket,
            });
        }

    }));

// TODO replace with actual implementation once we have a user object
passport.serializeUser(function(user, done)
{
    done(null, JSON.stringify(user));
});

passport.deserializeUser(function(userString, done)
{
    done(null, JSON.parse(userString))
})

export var initialize = function()
{
    return passport.initialize();
}
export var session = function()
{
    return passport.session({
        pauseStream: true,
        failureRedirect: '/login'
    });
}

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
export function ensureAuthenticated(req, res, next)
{
    console.log("Ensuring authentication");
    console.log(req._passport);
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
}

export function loginPage()
{
    return passport.authenticate('cas', {
        successRedirect: '/'
    })
}

export function logoutPage()
{
    return function(req, res, next)
    {
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
    }
}
