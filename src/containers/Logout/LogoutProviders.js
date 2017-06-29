/**
 * Copyright (C) 2017 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { injectT } from 'ndla-i18n';
import { toLogoutFederated, toLogoutSession } from '../../routes';

const LogoutProviders = ({ t }) =>
  <div className="c-logout-providers">
    <Link to={toLogoutSession()} className="c-button c-button--outline">
      {t('logoutProviders.localLogout')}
    </Link>
    <p className="c-logout-providers__or">
      {t('logoutProviders.or')}
    </p>
    <Link to={toLogoutFederated()} className="c-button c-button--outline">
      {t('logoutProviders.federatedLogout')}
    </Link>
    <p>
      {t('logoutProviders.description')}
    </p>
  </div>;

export default injectT(LogoutProviders);
