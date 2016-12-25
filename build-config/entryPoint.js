const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '/../src-client');
const entryPath = path.join(srcPath, 'entry');

function buildEntryPointsList() {
    var entry = {};
    fs.readdirSync(entryPath).forEach(file => {
        const filename = file.match(/(.*).js$/);
        if (filename) {
            const chunkname = filename[1];
            entry[chunkname] = path.resolve(entryPath, filename[0]);
        }
    });

    return entry;
}

module.exports = {
    srcPath,
    entryPath,
    buildEntryPointsList,
};
