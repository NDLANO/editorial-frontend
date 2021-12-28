/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import BEMHelper from 'react-bem-helper';
import FormField from './FormField';
import FormFieldHelp from './FormFieldHelp';

export const classes = new BEMHelper({
  name: 'field',
  prefix: 'c-',
});

export { FormFieldHelp };

export default FormField;
