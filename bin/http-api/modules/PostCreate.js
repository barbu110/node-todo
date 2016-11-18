const ApiModule = require('../ApiModule');
const Form = require('multiparty').Form;
const Post = require('../../post/Post');
const PostsRepository = require('../../post/PostsRepository');
const async = require('async');

class PostCreate extends ApiModule {

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

module.exports = PostCreate;
