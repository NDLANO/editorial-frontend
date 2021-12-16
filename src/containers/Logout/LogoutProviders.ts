/**
 * Copyright (C) 2017 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toLogoutSession } from '../../util/routeHelpers';

const LogoutProviders = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(toLogoutSession());
  });
  return null;
};

export default LogoutProviders;
