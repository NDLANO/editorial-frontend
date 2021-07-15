/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { EffectCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { actions } from '../../modules/session/session';
import { parseHash } from '../../util/authHelpers';
import { toLogin } from '../../util/routeHelpers';
import { RouteComponentProps } from 'react-router';

interface Props{
  loginSuccess: ({}) => void;
  location: {
    hash: RouteComponentProps['location']['hash'];
  }
  history: RouteComponentProps['history'];
}

export const LoginSuccess = ({loginSuccess, location : { hash }, history}: Props) => {


  useEffect(()  => {
    parseHash(hash).then(authResult => {
      if (authResult && authResult?.scope?.includes(':')) {
        if (authResult.accessToken) {
          if (authResult.state) {
            window.location.href = authResult.state;
          }
          loginSuccess({
            accessToken: authResult.accessToken,
            history,
          });
        }
      } else {
        history.replace(`${toLogin()}/failure`);
      }
    });
    
  }, [])

  return null;
}

const mapDispatchToProps = {
  loginSuccess: actions.loginSuccess,
};
export default connect(undefined, mapDispatchToProps)(LoginSuccess);
