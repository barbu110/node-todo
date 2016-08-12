const FileStreamRotator = require('file-stream-rotator');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

const logDirectory = path.join(__dirname, '../../log/http');

if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

const accessLogStream = FileStreamRotator.getStream({
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
