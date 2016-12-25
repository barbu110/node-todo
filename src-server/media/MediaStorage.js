/**
 * @providesModule MediaStorage
 */

import Database from 'Database';
import Configuration from 'Configuration';
import moment from 'moment';
import async from 'async';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export default class MediaStorage {

    /**
     * Upload specified files from the exposed ones.
     *
     * @param {IncomingMessage} request Request came from the client.
     * @param {object[]} exposedFiles The files exposed by multiparty.parse
     * @param {string|string[]} files Array of file identifiers to process.
     * If this is not specified, all the request files will be
     * uploaded and indexed.
     * @param {function(err: ?Error, tokens: ?object)} callback
     * @throws {Error} If the callback is not a function.
     */
    static upload(request, exposedFiles, files, callback) {
        if (typeof callback !== 'function') {
            throw new Error('Callback must be a function');
        }
        if (typeof files === 'string') {
            files = [ files ];
        }

        let fileTokens = {};
        async.each(files, (id, cb) => {
            if (!exposedFiles[id]) {
                cb(new Error(`File identified by ${id} was not found`));
            }

            const fileInfo = exposedFiles[id];
            const databaseToken = crypto.randomBytes(16).toString('hex');

            async.waterfall([
                (next) => Database.query('INSERT INTO media(id, mimetype) VALUES($1, $2)', [
                    databaseToken,
                    fileInfo.headers['content-type'],
                ], next),
                (next) => fs.rename(fileInfo.path, path.join(__dirname, Configuration.userData.mediaDir, databaseToken), next),
                (next) => {
                    fileTokens[id] = databaseToken;

                    next();
                },
            ], cb);
        }, err => {
            if (err) {
                callback(err);
                return;
            }

            callback(undefined, fileTokens);
        });
    }

}
