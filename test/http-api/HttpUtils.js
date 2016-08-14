/*eslint no-console:0 */

const express = require('express');
const request = require('supertest');
const async = require('async');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const useragent = require('express-useragent');

const Configuration = require('../../config.json');
const AuthManager = require('../../bin/user/AuthManager');
const HttpUtils = require('../../bin/http-api/HttpUtils');

const authManager = new AuthManager({
    connection: {
        remoteAddress: '127.0.0.1',
    },
    headers: {},
    useragent: {
        fake: true,
        bot: true,
    },
});

const app = express();
app.disable('x-powered-by');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(useragent.express());

app.get('/test', changeFakeReqIp, HttpUtils.enforceAuthentication, (req, res) => {
    res.send(typeof req.getSessionUser());
    res.end();
});
app.get('/permissions', [
    changeFakeReqIp,
    (req, res, next) => HttpUtils.enforceUserPermissions(req, res, next, [ 'viewPrivateItems' ]),
    (req, res) => {
        res.send('ok');
        res.end();
    },
]);
app.get('/permissions1', [
    changeFakeReqIp,
    (req, res, next) => HttpUtils.enforceUserPermissions(req, res, next, [ 'viewPrivateProfileData' ]),
    (req, res) => {
        res.sendStatus(200);
    },
]);

function changeFakeReqIp(req, res, next) {
    req.connection.remoteAddress = '127.0.0.1';
    req.headers['x-forwarded-for'] = '127.0.0.1';

    next();
}

describe('HttpUtils', () => {
    describe('#enforceAuthentication', () => {
        it('sends 403 if no user is logged in', done => {
            const tester = request.agent(app);
            tester
                .get('/test')
                .expect(403, done);
        });
        it('exposes getSessionUser()', done => {
            const tester = request.agent(app);
            async.waterfall([
                (next) => authManager.authenticate('victor', 'barbu', next),
                (jwt) => {
                    tester
                        .get('/test')
                        .set('Cookie', [ `${Configuration.auth.cookieName}=${jwt}` ])
                        .expect(200, done);
                },
            ], err => console.error(err));
        });
    });
    describe('#enforceUserPermissions', () => {
        it('sends 403 if no user is logged in', done => {
            const tester = request.agent(app);
            async.waterfall([
                next => tester.get('/permissions').expect(403, next),
                () => tester.get('/permissions1').expect(403, done),
            ]);
        });
        it('sends 200 when user has permissions', done => {
            const tester = request.agent(app);
            async.waterfall([
                next => authManager.authenticate('victor', 'barbu', next),
                jwt => {
                    tester
                        .get('/permissions')
                        .set('Cookie', [ `${Configuration.auth.cookieName}=${jwt}` ])
                        .expect(200, done);
                },
            ]);
        });
        it('sends 403 when user does not have the required permissions', done => {
            const tester = request.agent(app);
            async.waterfall([
                next => authManager.authenticate('victor', 'barbu', next),
                jwt => {
                    tester
                        .get('/permissions1')
                        .set('Cookie', [ `${Configuration.auth.cookieName}=${jwt}` ])
                        .expect(403, done);
                },
            ]);
        });
    });
});
