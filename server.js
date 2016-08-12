if (global.v8debug) {
    global.v8debug.Debug.setBreakOnException();
}

const underscore = require('underscore');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const useragent = require('express-useragent');
const Router = require('./bin/router');
const ServerUtils = require('./bin/server-utils');
const AuthManager = require('./bin/user/AuthManager');
const Configuration = require('./config.json');
const moment = require('moment');
const Database = require('./bin/database');

Error.stackTraceLimit = Infinity;

const app = express();

ServerUtils.getLogger(app);

app.disable('x-powered-by');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(useragent.express());
app.set('views', path.join(__dirname, 'template'));
app.set('view engine', 'pug');

app.use('/assets', express.static('./dist/assets'));

underscore.each(Router.getRoutes(), (route, identity) => {
    const callbacks = [
        (req, res) => res.render('index', {
            identity,
            title: route.title,
            styleModule: Router.getModulePath(route.styleModule, 'style'),
            jsModule: Router.getModulePath(route.jsModule, 'js'),
            documentData: route.data || {},
        }),
    ];
    const method = route.method || 'get';

    app[method](route.url, ...callbacks);
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    const authManager = new AuthManager(req);
    authManager.authenticate(username, password, (account, jwt) => {
        res.cookie(Configuration.auth.cookieName, jwt);
        res.json({
            success: true,
        });
        res.end();
    });
});

app.post('/api/logout', (req, res) => {
    const authManager = new AuthManager(req);
    authManager.logout(err => {
        if (err) {
            console.error('Failed to log out: ', err);
        }

        res.clearCookie(Configuration.auth.cookieName);
        res.json({
            success: err ? false : true,
        });
        res.end();
    });
});

app.get('/api/secure', (req, res) => {
    const authManager = new AuthManager(req);
    authManager.verifyIdentity((err, account) => {
        if (err) {
            res.json(err);
            res.end();

            return;
        }

        if (account === null) {
            res.sendStatus(403);

            return;
        }

        res.json(account);
        res.end();
    });
});

app.listen(8080, () => {
    /*eslint no-console:0 */
    console.log('Listening on http://localhost:8080');
});
