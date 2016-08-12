const path = require('path');
const minimist = require('minimist');

const args = minimist(process.argv.slice(2));
const allowedEnvs = [ 'dev', 'dist' ];

const env = args.dist ? 'dist' : 'dev';
process.env.REACT_WEBPACK_ENV = env;

function buildConfig(wantedEnv) {
    const isValid = wantedEnv && wantedEnv.length > 0 && allowedEnvs.indexOf(wantedEnv) !== -1;
    const validEnv = isValid ? wantedEnv : 'dev';

    return require(path.join(__dirname, 'build', 'conf', validEnv));
}

console.log('Building scripts for environment: ' + env);
module.exports = buildConfig(env);
