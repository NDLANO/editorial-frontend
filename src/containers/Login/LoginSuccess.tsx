/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { History } from 'history';
import { actions } from '../../modules/session/session';
import { parseHash } from '../../util/authHelpers';
import { toLogin } from '../../util/routeHelpers';

type Success = {
  accessToken: string;
  history: History;
};
interface Props extends RouteComponentProps {
  loginSuccess: (arg0: Success) => void;
}

export const LoginSuccess = ({ loginSuccess, location: { hash }, history }: Props) => {
  useEffect(() => {
    parseHash(hash).then(authResult => {
      if (authResult.scope?.includes(':') && authResult.accessToken) {
        if (authResult.state) {
          window.location.href = authResult.state;
        }
        loginSuccess({
          accessToken: authResult.accessToken,
          history,
        });
      } else {
        history.replace(`${toLogin()}/failure`);
      }
    });
  }, [hash, history, loginSuccess]);

  return null;
};

const mapDispatchToProps = {
  loginSuccess: actions.loginSuccess,
};
export default connect(undefined, mapDispatchToProps)(LoginSuccess);
