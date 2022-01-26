/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect } from 'react';
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';
import { useSession } from '../Session/SessionProvider';

export const LogoutSession = () => {
  const { logout } = useSession();
  const location = useLocation();
  useEffect(() => {
    const query = queryString.parse(location.search);
    logout(false, !!query?.returnToLogin);
  }, []); //  eslint-disable-line

  return null;
};

export default LogoutSession;
