/**
 * @providesModule Database
 */

/*eslint no-console:0 */

import Configuration from 'Configuration';

const db = require('knex')({
    client: 'pg',
    debug: true,
    connection: {
        user: Configuration.database.work.user,
        database: Configuration.database.work.database,
        password: Configuration.database.work.password,
        port: Configuration.database.work.port,
    },
    pool: {
        min: 0,
        max: 20,
    },
    acquireConnectionTimeout: 3000,
});

module.exports = db;
