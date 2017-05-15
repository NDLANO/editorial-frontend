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
  const { message, match } = props;
  let messageEl;
  if (message) {
    messageEl = <p>{message}</p>;
  }

  return (
    <OneColumn cssModifier="narrow">
      <Route path={`${match.url}/success`} component={SessionInitializer} />
      <Route path={`${match.url}/failure(/)`} component={LoginFailure} />
      <h3>TODO ... Denne må hentes fra poloygot later</h3>
      {messageEl}
      <ul className="vertical-menu">
        <li className="vertical-menu_item"><button onClick={() => loginSocialMedia('google-oauth2')} className="un-button cta-link cta-link--block cta-link--gl">Google</button></li>
        <li className="vertical-menu_item"><button onClick={() => loginSocialMedia('facebook')} className="un-button cta-link cta-link--block cta-link--fb">Facebook</button></li>
        <li className="vertical-menu_item"><button onClick={() => loginSocialMedia('twitter')} className="un-button cta-link cta-link--block cta-link--tw">Twitter</button></li>
      </ul>
    </OneColumn>
  );
};

LoginProviders.propTypes = {
  message: PropTypes.string,
  match: PropTypes.object.isRequired,
};

export default injectT(LoginProviders);
