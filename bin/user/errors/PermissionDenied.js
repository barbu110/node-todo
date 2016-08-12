class PermissionDeniedError extends Error {

    constructor(message) {
        super(message);
    }

}

module.exports = PermissionDeniedError;
