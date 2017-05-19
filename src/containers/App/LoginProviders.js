/*
 * Part of NDLA editorial-frontend.
 * Copyright (C) 2017 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { OneColumn } from 'ndla-ui';
import { injectT } from '../../i18n';
import { loginSocialMedia } from './sessionActions';
import LoginFailure from './LoginFailure';
import SessionInitializer from './SessionInitializer';


export const LoginProviders = (props) => {
  const { t, message, match } = props;
  let messageEl;
  if (message) {
    messageEl = <p>{message}</p>;
  }

  return (
    <OneColumn cssModifier="narrow">
      <Route path={`${match.url}/success`} component={SessionInitializer} />
      <Route path={`${match.url}/failure(/)`} component={LoginFailure} />
      <h3>{t('loginProviders.description')}</h3>
      {messageEl}
      <ul className="vertical-menu">
        <li className="vertical-menu_item"><button onClick={() => loginSocialMedia('google-oauth2')} className="login-button btn-google c-button">Google</button></li>
        <li className="vertical-menu_item"><button onClick={() => loginSocialMedia('facebook')} className="login-button btn-fb c-button">Facebook</button></li>
        <li className="vertical-menu_item"><button onClick={() => loginSocialMedia('twitter')} className="login-button btn-twitter c-button">Twitter</button></li>
      </ul>
    </OneColumn>
  );
};

LoginProviders.propTypes = {
  message: PropTypes.string,
  match: PropTypes.shape({
    path: PropTypes.string,
    exact: PropTypes.bool,
    strict: PropTypes.bool,
  }).isRequired,
};

export default injectT(LoginProviders);
