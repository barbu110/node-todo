const ApiModule = require('../../bin/http-api/ApiModule');
const Loader = require('../../bin/http-api/Loader');

const expect = require('expect');
const express = require('express');
const path = require('path');

const expressApp = express();

describe('Loader', () => {
    const loader = new Loader(expressApp, path.join(__dirname, './fake-modules'));

    it('loads the modules correctly', () => {
        const modules = loader.getModules();

        expect(modules.size).toEqual(3);
        modules.forEach(apiModule => expect(apiModule).toBeAn(ApiModule));
    });
});
