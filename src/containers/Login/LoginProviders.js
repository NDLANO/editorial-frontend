/**
 * Copyright (C) 2017 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { injectT } from '@ndla/i18n';
import { loginPersonalAccessToken } from '../../util/authHelpers';

export const LoginProviders = ({ t }) => [
  <h3 key="login-providers_title">{t('loginProviders.description')}</h3>,
  <ul key="login-providers_list" className="vertical-menu">
    <li className="vertical-menu_item">
      <button
        type="button"
        onClick={() => loginPersonalAccessToken('google-oauth2')}
        className="login-button btn-google c-button">
        Google
      </button>
    </li>
  </ul>,
];

export default injectT(LoginProviders);
