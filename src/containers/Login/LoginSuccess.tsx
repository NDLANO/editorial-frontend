/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { parseHash } from '../../util/authHelpers';
import { toLogin } from '../../util/routeHelpers';
import { useSession } from '../Session/SessionProvider';

export const LoginSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useSession();
  useEffect(() => {
    parseHash(location.hash).then(authResult => {
      if (authResult.scope?.includes(':') && authResult.accessToken) {
        if (authResult.state) {
          window.location.href = authResult.state;
        }
        login(authResult.accessToken);
      } else {
        navigate(`${toLogin()}/failure`, { replace: true });
      }
    });
  }, []); //  eslint-disable-line

  return null;
};
export default LoginSuccess;
