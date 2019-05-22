/**
 * Copyright (C) 2017 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { toLogoutSession } from '../../util/routeHelpers';

const LogoutProviders = () => {
  document.location.href = toLogoutSession();
  return <div />;
};

export default LogoutProviders;
