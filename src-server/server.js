import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import useragent from 'express-useragent';
import ServerUtils from 'ServerUtils';
import HttpApiModulesLoader from 'HttpApiModulesLoader';
import Configuration from 'Configuration';

const app = express();

ServerUtils.getLogger(app);

app.disable('x-powered-by');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(useragent.express());
app.set('views', path.join(Configuration.platformRoot, 'template'));
app.set('view engine', 'pug');

app.use('/assets', express.static(path.join(Configuration.platformRoot, 'dist', 'assets')));

const httpApiRouter = express.Router();
app.use('/api', httpApiRouter);

const apiModuleLoader = new HttpApiModulesLoader(httpApiRouter);
apiModuleLoader.populateRouter();

app.get('*', (req, res) => res.render('index'));

app.listen(8080, () => {
    /*eslint no-console:0 */
    console.log('Listening on http://localhost:8080');
});
