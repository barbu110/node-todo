const ApiModule = require('../../bin/http-api/ApiModule');
const InvalidHTTPMethodError = require('../../bin/http-api/InvalidHTTPMethodError');
const InvalidRouteErrord = require('../../bin/http-api/InvalidRouteError');

const expect = require('expect');
const express = require('express');
const async = require('async');

describe('ApiModule', () => {
    describe('#enforceUserPermissions', () => {
        it('transforms a string into a one-item array', () => {
            const apiModule = new ApiModule();
            apiModule.enforceUserPermissions('test');

            expect(apiModule._enforcePermissions).toEqual([ 'test' ]);
        });
    });
    describe('#setMethod', () => {
        it('throws on invalid method', () => {
            const apiModule = new ApiModule();

            expect(() => apiModule.setMethod('invalid')).toThrow(InvalidHTTPMethodError);
        });
        it('validated a lowercase method', () => {
            const apiModule = new ApiModule();
            apiModule.setMethod('POsT');

            expect(apiModule._method).toEqual('post');
        });
    });
    describe('#setRoute', () => {
        it('throws on not-string route', () => {
            const apiModule = new ApiModule();

            expect(() => apiModule.setRoute(123)).toThrow(InvalidRouteErrord);
        });
        it('sanitizes route', () => {
            const apiModule = new ApiModule();
            apiModule.setRoute('user//my-api');

            expect(apiModule._route).toEqual('/user/my-api');
        });
    });
    describe('#buildHandler', () => {
        const fakeRouter = express.Router();
        it('throws on invalid configuration', () => {
            const apiModule = new ApiModule();

            expect(() => apiModule.buildHandler(fakeRouter)).toThrow();
        });
        it('set GET as default method', () => {
            const apiModule = new ApiModule();
            apiModule.execute = () => {};
            apiModule.setRoute('my-api');

            apiModule.buildHandler(fakeRouter);

            expect(apiModule._method).toEqual('get');
        });
    });
});
