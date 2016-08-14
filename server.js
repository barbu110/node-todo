const underscore = require('underscore');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const useragent = require('express-useragent');
const Router = require('./bin/router');
const ServerUtils = require('./bin/server-utils');
const ApiModuleLoader = require('./bin/http-api/Loader');

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

const httpApiRouter = express.Router();
app.use('/api', httpApiRouter);

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

const apiModuleLoader = new ApiModuleLoader(httpApiRouter);
apiModuleLoader.populateRouter();

app.listen(8080, () => {
    /*eslint no-console:0 */
    console.log('Listening on http://localhost:8080');
});
