const constants = require('./PermissionsConstants');
const underscore = require('underscore');

module.exports = underscore.map(constants, ct => constants[ct]);
