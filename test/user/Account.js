const expect = require('expect');
const Account = require('../../bin/user/Account');
const AccountPermissions = require('../../bin/user/AccountPermissions');

describe('Account', () => {
    describe('#setToken', () => {
        const account = new Account();

        it('should throw on invalid-length token', () => {
            expect(() => {
                account.setToken('invalid');
            }).toThrow('Invalid token format. The account token must be 32 bytes long');
        });
    });
    describe('#setPermissions', () => {
        it('should work on numeric input', () => {
            const mask = 2;

            const account = new Account();
            account.setPermissions(mask);
            expect(account.getPermissions()._permissions).toInclude({
                viewPrivateItems: true,
            }, 'Failed setting permissions from numeric mask');
        });
        it('should work on raw object input', () => {
            const input = {
                viewPrivateItems: true,
            };

            const account = new Account();
            account.setPermissions(input);
            expect(account.getPermissions()._permissions).toInclude({
                viewPrivateItems: true,
            });
        });
        it('should work with copy constructor', () => {
            const accountPermissions = new AccountPermissions({
                viewPrivateItems: true,
            });

            const account = new Account();
            account.setPermissions(accountPermissions);
            expect(account.getPermissions()).toEqual(accountPermissions);
        });
    });
});
