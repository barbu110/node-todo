/**
 * @providesModule Configuration
 */

const path = require('path');

module.exports = {
    platformRoot: path.resolve(__dirname),
    auth: {
        jwtSecret: "RF9pLjSUKfnRY47N",
        cookieName: "sess",
        expirationDuration: {
            value: 1,
            unit: "days",
        },
    },
    httpApi: {
        modulesLocation: "./http-api/modules",
    },
    logger: {
        http: {
            accessRoot: path.resolve(path.join(__dirname, 'log', 'http')),
        },
    },
    userData: {
        mediaDir: "./user-data/media",
    },
    database: {
        work: {
            user: "victor",
            password: "barbu",
            database: "todoapp",
            port: 5432,
        },
        test: {
            user: "victor",
            database: "todoapp-test",
            port: 5432,
        },
    },
};
