const Post = require('./Post');
const Database = require('../database');
const crypto = require('crypto');
const moment = require('moment');
const async = require('async');
const AccountsRepository = require('../user/AccountsRepository');

class PostsRepository {

    /**
     * Check whether a given post is valid for database operations.
     *
     * @param {Post} post
     * @param {string} operation Operation to validate for. Can be: 'create', 'edit'.
     * @return {Boolean}
     */
    validateForDB(post, operation) {
        if (!post.getToken() && operation === 'edit') {
            throw new Error('Post is missing the token');
        }
        if (!post.getHeadline()) {
            throw new Error('Post is missing the headline');
        }
        if (!post.getContent()) {
            throw new Error('Post is missing the content');
        }
    }

    /**
     * Register a post into the database.
     *
     * @param {Post} post
     * @param {function(err: ?Error, post: ?Post)} callback
     */
    create(post, callback) {
        if (typeof callback !== 'function') {
            throw new Error('The provided callback is not a function');
        }

        if (!post.getHeadline() && !post.isDraft()) {
            callback(new Error('Only drafts can have null/empty headline'));
            return;
        }
        if (!post.getContent() && !post.isDraft()) {
            callback(new Error('Only drafts can have null/empty content'));
            return;
        }

        this.validateForDB(post, 'create');

        post.setToken(this.generateToken(16));
        post.setLastUpdateTime(moment());

        Database.query('INSERT INTO post VALUES($1, $2, $3, $4, $5, $6, $7, $8)', [
            post.getToken(),
            post.getOwner(),
            post.getLastUpdateTime(),
            post.getFeaturedPicture(),
            post.getHeadline(),
            post.getContent(),
            post.isDraft(),
            JSON.stringify(post.getTags()),
        ])
            .then(res => callback(
                res.rowCount ? undefined : new Error('Post creation failed'),
                res.rowCount ? post : undefined
            ))
            .catch(callback);
    }

    /**
     * Edit an already existing post.
     *
     * @param {string} postToken The token of the post to edit.
     * @param {Account} actor The user that owns the action.
     * @param {Post} newPostData The edited post.
     * @param {function(err: ?Error, post: ?Post)} callback
     */
    edit(postToken, actor, newPostData, callback) {
        if (typeof callback !== 'function') {
            throw new Error('The provided callback is not a function');
        }

        if (!newPostData.getHeadline() && !newPostData.isDraft()) {
            callback(new Error('Only drafts can have null/empty headline'));
            return;
        }
        if (!newPostData.getContent() && !newPostData.isDraft()) {
            callback(new Error('Only drafts can have null/empty content'));
            return;
        }

        this.validateForDB(newPostData, 'edit');
        if (newPostData.getToken() !== postToken) {
            callback(new Error('Invalid post token provided.'));
            return;
        }

        newPostData.setToken(postToken);
        newPostData.setLastUpdateTime(moment());

        async.waterfall([
            (next) => this.canEdit(actor.getToken(), postToken, next),
            (canEdit, next) => {
                if (!canEdit) {
                    next(new Error(`The user ${actor.getDisplayName()} cannot edit this post.`));
                    return;
                }

                Database.query('UPDATE post SET update_time = $1, featured_picture = $2, headline = $3, content = $4, tags = $5', [
                    newPostData.getLastUpdateTime(),
                    newPostData.getFeaturedPicture(),
                    newPostData.getHeadline(),
                    newPostData.getContent(),
                    JSON.stringify(newPostData.getTags()),
                ], next);
            },
            (result, next) => {
                if (!result.rowCount) {
                    next(new Error('Failed to update'));
                }

                next(undefined, newPostData);
            },
        ], callback);
    }

    /**
     * Check whether a specific user can edit the given post.
     *
     * NOTE: A user can only edit a post that belongs to them. (i.e. the
     * user owns that post)
     *
     * @param {string} userToken The token of the user account.
     * @param {string} postToken The token of the post to verify.
     * @param {function(err: ?Error, canEdit: ?boolean)} callback
     */
    canEdit(userToken, postToken, callback) {
        if (typeof callback !== 'function') {
            throw new Error('The provided callback is not a function');
        }

        async.waterfall([
            (next) => Database.query('SELECT owner FROM post WHERE token = $1', [ postToken ], next),
            (result, next) => {
                if (!result.rowCount) {
                    next(new Error('The post was not found'));
                }

                const owner = result.rows[0].owner;
                callback(undefined, owner === userToken);
                next();
            },
        ], callback /* if any error appears, callback should handle them */);
    }

    /**
     * Delete an existing post.
     *
     * @param {string} postToken The token of the post.
     * @param {Account} actor The user that is supposed to do the action.
     * @param {function(err: ?Error)} callback If error is a false value, the operation succeeded.
     */
    delete(postToken, actor, callback) {
        if (typeof callback !== 'function') {
            throw new Error('The provided callback is not a function');
        }

        async.waterfall([
            (next) => this.canDelete(actor, postToken, next),
            (canDelete, next) => {
                if (!canDelete) {
                    next(new Error(`User ${actor.getDisplayName()} cannot delete the post ${postToken}`));
                    return;
                }

                Database.query('DELETE FROM post WHERE token = $1', [ postToken ], next);
            },
            (result, next) => {
                if (!result.rowCount) {
                    next(new Error('Failed to delete'));
                    return;
                }

                next();
            },
        ], callback);
    }

    /**
     * Check whether a user can delete a specific post.
     *
     * NOTE: A user can only delete posts that belong to them. If the user has
     * the permission 'deletePosts', then they can delete any post on the site.
     *
     * @param {Account} user The subject user account.
     * @param {string} postToken The token of the post in case.
     * @param {function(err: ?Error, canDelete: ?boolean)} callback
     */
    canDelete(user, postToken, callback) {
        if (typeof callback !== 'function') {
            throw new Error('The provided callback is not a function');
        }

        if (!user.can('deletePosts')) {
            callback(undefined, false);
        }

        async.waterfall([
            (next) => Database.query('SELECT owner FROM posts WHERE token = $1', [ postToken ], next),
            (result, next) => {
                if (!result.rowCount) {
                    callback(new Error(`Post ${postToken} does not exist`));
                }

                const owner = result.rows[0].owner;
                next(undefined, owner === user.getToken());
            },
        ], callback);
    }

    /**
     * Get a post from the database identified by its token.
     *
     * @param {string} token The desired post token.
     * @param {function(err: ?Error, post: ?Post)} callback
     */
    get(token, callback) {
        if (typeof callback !== 'function') {
            throw new Error('The provided callback is not a function');
        }
        if (typeof token !== 'string') {
            callback(new Error('Invalid token provided. Not a string'));
        }

        async.waterfall([
            (next) => Database.query('SELECT * FROM post WHERE token = $1', [ token ], next),
            (result, next) => {
                if (!result.rowCount) {
                    next(new Error('Post not found'));
                    return;
                }

                const row = result.rows[0];
                const userRepo = new AccountsRepository();
                userRepo.getAccount({ token: row.owner }, (err, account) => next(err, account, row));
            },
            (owner, row, next) => {
                const post = new Post();

                post.setToken(row.token);
                post.setOwner(owner);
                post.setLastUpdateTime(row.last_update);
                post.setFeaturedPicture(row.featured_picture);
                post.setTags(JSON.parse(row.tags));
                post.setIsDraft(row.is_draft);
                post.setHeadline(row.headline);
                post.setContent(row.content);

                next(undefined, post);
            },
        ], callback);
    }

    /**
     * Generate random token.
     * @param {int} length
     * @return {string}
     */
    generateToken(length) {
        const buffer = crypto.randomBytes(length / 2);
        return buffer.toString('hex');
    }

}

module.exports = PostsRepository;
