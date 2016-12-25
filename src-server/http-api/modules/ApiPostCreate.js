import HttpApiModule from 'HttpApiModule';
import { Form } from 'multiparty';
import Post from 'Post';
import PostsRepository from 'PostsRepository';
import async from 'async';

class ApiPostCreate extends HttpApiModule {

    constructor() {
        super();

        this.setMethod('post');
        this.setRoute('/post/create');
        this.enforceAuthentication();
    }

    execute(req, res) {
        const form = new Form();
        const sessionUser = req.getSessionUser();

        form.parse(req, (err, fields, files) => {
            fields = fields || {};
            files = files || {};

            res.json({ fields, files });
        });

        async.waterfall([
            (next) => form.parse(req, (err, fields, files) => {
                fields = fields || {};
                files = files || {};

                next(err, fields, files);
            }),
            (fields, files, next) => {
                console.log();
            },
        ]);
    }

}

module.exports = ApiPostCreate;
