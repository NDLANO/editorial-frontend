/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { parseHash } from '../../util/authHelpers';
import { toLogin } from '../../util/routeHelpers';
import { useSession } from '../Session/SessionProvider';

interface Props extends RouteComponentProps {}

export const LoginSuccess = ({ location: { hash }, history }: Props) => {
  const { login } = useSession();
  useEffect(() => {
    parseHash(hash).then(authResult => {
      if (authResult.scope?.includes(':') && authResult.accessToken) {
        if (authResult.state) {
          window.location.href = authResult.state;
        }
        login(authResult.accessToken);
      } else {
        history.replace(`${toLogin()}/failure`);
      }
    });
  }, []); //  eslint-disable-line

  return null;
};
export default LoginSuccess;
