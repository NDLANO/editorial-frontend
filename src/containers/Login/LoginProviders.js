/**
 * Copyright (C) 2017 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { injectT } from 'ndla-i18n';
import { loginSocialMedia } from '../../util/authHelpers';

export const LoginProviders = ({ t }) =>
  <div>
    <h3>
      {t('loginProviders.description')}
    </h3>
    <ul className="vertical-menu">
      <li className="vertical-menu_item">
        <button
          onClick={() => loginSocialMedia('google-oauth2')}
          className="login-button btn-google c-button">
          Google
        </button>
      </li>
      <li className="vertical-menu_item">
        <button
          onClick={() => loginSocialMedia('facebook')}
          className="login-button btn-fb c-button">
          Facebook
        </button>
      </li>
    </ul>
  </div>;

export default injectT(LoginProviders);
