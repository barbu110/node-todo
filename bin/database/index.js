const pg = require('pg');
const Pool = require('./Pool');

const config = {
    user: 'victor',
    database: 'todoapp',
    password: 'barbu',
    port: 5432,
    max: 20,
    idleTimeoutMillis: 3000,
};

const pool = new Pool(config);

pool.on('error', err => {
    console.log(err);
});

module.exports = {
    query: pool.query,
};
