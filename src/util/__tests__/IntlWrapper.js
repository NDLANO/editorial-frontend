/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import IntlProvider from 'ndla-i18n';
import { getLocaleObject } from '../../i18n';

export default ({ children }) => (
  <IntlProvider locale="nb" messages={getLocaleObject().messages}>
    {children}
  </IntlProvider>
);
