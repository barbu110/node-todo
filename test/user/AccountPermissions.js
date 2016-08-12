const expect = require('expect');
const AccountPermissions = require('../../bin/user/AccountPermissions');

describe('AccountPermissions', () => {
    describe('#constructor', () => {
        it('should work with empty object', () => {
            expect(() => {
                new AccountPermissions({});
            }).toNotThrow();
        });
        it('should not throw with valid object', () => {
            const permissions = {
                viewPrivateProfileData: false,
                viewPrivateItems: true,
            };

            expect(() => new AccountPermissions(permissions)).toNotThrow();
        });
        it('should throw with unknown permission name', () => {
            const permissions = {
                unknown: true,
            };

            expect(() => new AccountPermissions(permissions))
                .toThrow('Unknown permission "unknown".');
        });
        it('should throw with invalid permission value (other than boolean)', () => {
            const permissions = {
                viewPrivateProfileData: 'is here',
            };

            expect(() => new AccountPermissions(permissions))
                .toThrow('Permissions can be either "true" or "false"');
        });
        it('should contain all permissions', () => {
            const permissions = {
                viewPrivateItems: true,
            };
            const expectedPermissions = {
                viewPrivateItems: true,
                viewPrivateProfileData: false,
            };

            const accountPermissions = new AccountPermissions(permissions);

            expect(accountPermissions._permissions)
                .toEqual(expectedPermissions, 'Permissions are not correctly merged');
        });
    });
    describe('#convertToNumber', () => {
        it('should export numeric mask correctly', () => {
            const permissions = {
                viewPrivateItems: true,
            };
            const expectedMask = 2;
            const accountPermissions = new AccountPermissions(permissions);
            expect(accountPermissions.convertToNumber())
                .toEqual(expectedMask, 'Permissions were not converted to numeric mask successfully');
        });
    });
    describe('#convertFromNumber', () => {
        it('should work with mask containing only existing permissions', () => {
            const mask = 2;
            const expectedPermissions = {
                viewPrivateProfileData: false,
                viewPrivateItems: true,
            };

            const accountPermissions = AccountPermissions.convertFromNumber(mask);
            expect(accountPermissions._permissions)
                .toEqual(expectedPermissions, 'Numerical masks are not converted correctly');
        });
        it('should work with mask containing more than the existing permissions', () => {
            const mask = 1023;

            const expectedPermissions = {
                viewPrivateProfileData: true,
                viewPrivateItems: true,
            };

            const accountPermissions = AccountPermissions.convertFromNumber(mask);
            expect(accountPermissions._permissions)
                .toEqual(expectedPermissions, 'Numerical masks are not converted correctly');
        });
    });
    describe('#setPermissions', () => {
        it('should work with a valid set of known permissions', () => {
            const initialPermissions = {
                viewPrivateItems: true,
            };
            const expectedPermissions = {
                viewPrivateItems: true,
                viewPrivateProfileData: true,
            };

            const accountPermissions = new AccountPermissions(initialPermissions);
            accountPermissions.setPermissions({
                viewPrivateProfileData: true,
            });

            expect(accountPermissions._permissions)
                .toEqual(expectedPermissions, 'Partial permissions assignment not working properly');
        });
        it('should throw on unknown permissions', () => {
            const initialPermissions = {
                viewPrivateItems: true,
            };

            const accountPermissions = new AccountPermissions(initialPermissions);

            expect(() => {
                accountPermissions.setPermissions({
                    viewPrivateProfileData: true,
                    unknownPermission: true,
                });
            }).toThrow('Unknown permission "unknownPermission".');
        });
    });
    describe('#setPermission', () => {
        it('should work on existing permission names', () => {
            const initialPermissions = {
                viewPrivateItems: true,
            };

            const accountPermissions = new AccountPermissions(initialPermissions);
            accountPermissions.setPermission('viewPrivateItems', false);

            expect(accountPermissions._permissions).toInclude({
                viewPrivateItems: false,
            }, 'Known permission set failed');
        });
        it('should throw on unknown permission names', () => {
            const accountPermissions = new AccountPermissions({});

            expect(() => {
                accountPermissions.setPermission('unknown', true);
            }).toThrow('Unknown permissions identifier "unknown"');
        });
    });
    describe('#getPermission', () => {
        it('should work on existing permission identifiers', () => {
            const initialPermissions = {
                viewPrivateItems: true,
            };

            const accountPermissions = new AccountPermissions(initialPermissions);
            expect(accountPermissions.getPermission('viewPrivateItems'))
                .toEqual(true, 'Failed reading the permission');
        });
        it('should throw on unknown permissions', () => {
            const accountPermissions = new AccountPermissions({});
            expect(() => {
                accountPermissions.getPermission('invalid');
            }).toThrow('Unknown permission identifier "invalid"');
        });
    });
});
