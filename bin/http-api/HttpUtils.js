const AuthManager = require('../user/AuthManager');

/**
 * Utility class for HTTP API modules.
 */
class HttpUtils {

    /**
     * Enforce user to be authenticated.
     *
     * @param {Request} req
     * @param {Response} res
     * @param {function} next
     */
    static enforceAuthentication(req, res, next) {
        const authManager = new AuthManager(req);
        authManager.verifyIdentity((err, account) => {
            if (!err && account) {
                req.getSessionUser = () => account;
                next();
            }

            res.status(403);
            res.json({
                error: 'forbidden',
            });
            res.end();
        });
    }

    /**
     * Enforce user permissions to exist.
     *
     * @param {Request} req
     * @param {Response} res
     * @param {function} next
     * @param {string[]} permissions
     */
    static enforceUserPermissions(req, res, next, permissions) {
        if (!(permissions instanceof Array)) {
            throw new Error('Permissions must be an array');
        }

        HttpUtils.enforceAuthentication(req, res, () => {
            const account = req.getSessionUser();
            const p = permissions.filter(perm => !account.can(perm));

            if (p.length === 0) {
                return next();
            }

            res.status(403);
            res.json({
                error: 'forbidden',
                details: `You do not have the permissions: ${p.join(', ')}`,
            });
            res.end();
        });
    }

}

module.exports = HttpUtils;
