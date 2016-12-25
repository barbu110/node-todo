/**
 * @providesModule Post
 */

import Account from 'Account';
import stringSize from 'stringSize';
import moment from 'moment';
import trimWhitespace from 'trimWhitespace';
import _ from 'underscore';

export default class Post {

    /**
     * Set the token of the post.
     *
     * @param {string} newToken 16-characters long post token.
    */
    setToken(newToken) {
        this._token = newToken;
    }

    /**
     * Set the owner of the post. The owner is the account that created
     * the post originally.
     *
     * @param {Account} newOwner
     */
    setOwner(newOwner) {
        if (!(newOwner instanceof Account)) {
            throw new Error('The owner of a post must be an Account.');
        }
        this._owner = newOwner;
    }

    /**
     * Set the last update timestamp.
     *
     * @param {string} timestamp Valid ISO8601 datetime string.
     */
    setLastUpdateTime(timestamp = '') {
        this._lastUpdateTime = moment(timestamp);
    }

    /**
     * Set the featured image token.
     *
     * @param {string} imageToken Image token as created by the media system.
     */
    setFeaturedPicture(imageToken) {
        this._featuredPicture = imageToken;
    }

    /**
     * Set the tags of the post.
     *
     * @param {string|string[]} tags Can be either an array of strings, or a comma-separated tags list.
     */
    setTags(tags) {
        if (typeof tags === 'string') {
            tags = tags.split(',').map(trimWhitespace);
        }

        this._tags = _.uniq(tags);
    }

    /**
     * Add a tag to the post.
     *
     * @param {string} tag
     */
    addTag(tag) {
        if (typeof tag !== 'string') {
            throw new Error(`Invalid tag supplied of type ${typeof tag}`);
        }
        if (!this._tags) {
            this._tags = [];
        }

        tag = trimWhitespace(tag);
        if (tags.indexOf(tag) !== '-1') {
            this._tags.push(tag);
        }
    }

    /**
     * Remove a tag of the post.
     *
     * @param {string} tag
     */
    removeTag(tag) {
        if (typeof tag !== 'string') {
            throw new Error(`Invalid tag supplied of type ${typeof tag}`);
        }
        if (!this._tags) {
            this._tags = [];
        }

        return _.without(this._tags, tag);
    }

    /**
     * Set the headline of the post.
     *
     * @param {string} newHeadline
     */
    setHeadline(newHeadline) {
        this._headline = newHeadline;
    }

    /**
     * Set the content of the post.
     *
     * @param {string} newContent
     */
    setContent(newContent) {
        this._content = newContent;
    }

    /**
     * Set the draft condition of the post.
     *
     * @param {boolean} isDraft Whether the post should be a draft or not.
     */
    setIsDraft(isDraft) {
        this._isDraft = isDraft;
    }

    /**
     * Get the token of the post.
     *
     * @return {string}
     */
    getToken() {
        return this._token;
    }

    /**
     * Get the initial owner of the post.
     *
     * @return {Account}
     */
    getOwner() {
        return this._owner;
    }

    /**
     * Get the timestamp of the last update.
     *
     * @return {moment}
     */
    getLastUpdateTime() {
        return this._lastUpdateTime;
    }

    /**
     * Get featured picture token.
     *
     * @return {string}
     */
    getFeaturedPicture() {
        return this._featuredPicture;
    }

    /**
     * Get the tags of the post or an empty array.
     *
     * @return {string[]} If the tags were not previously
     * set, it returns an empty array.
     */
    getTags() {
        if (!this._tags) {
            this._tags = [];
        }

        return this._tags;
    }

    /**
     * Get the headline of the post.
     *
     * @return {string}
     */
    getHeadline() {
        return this._headline;
    }

    /**
     * Get the content of the post.
     *
     * @return {string}
     */
    getContent() {
        return this._content;
    }

    /**
     * Get the size of the post's content.
     *
     * @return {int}
     * @throws {Error} If the content was not set.
     */
    getSize() {
        if (!this._content) {
            throw new Error('The content of the post was not set.');
        }
        return stringSize(this._content);
    }

    /**
     * Check whether the post is draft or not.
     *
     * @return {boolean}
     */
    isDraft() {
        return this._isDraft;
    }

}
