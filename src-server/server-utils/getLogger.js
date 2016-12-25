/**
 * @providesModule ServerUtils/getLogger
 */

const FileStreamRotator = require('file-stream-rotator');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const Configuration = require('Configuration');

const logDirectory = Configuration.logger.http.accessRoot;

if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

const accessLogStream = FileStreamRotator.getStream({
	/*eslint camelcase:0 */
    date_format: 'YYYYMMDD',
    filename: path.join(logDirectory, 'access-%DATE%.log'),
    frequency: 'daily',
    verbose: false,
});

/**
 * Get the application logger.
 *
 * @param app Express application
 */
function getLogger(app) {
    app.use(morgan('combined', {
        stream: accessLogStream,
    }));
}

module.exports = getLogger;
