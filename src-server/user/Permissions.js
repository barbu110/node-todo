/**
 * @providesModule Permissions
 */

import constants from './PermissionsConstants';
import underscore from 'underscore';

export default underscore.map(constants, ct => constants[ct]);
