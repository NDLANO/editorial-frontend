/*
 * Part of NDLA editorial-frontend.
 * Copyright (C) 2017 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { OneColumn } from 'ndla-ui';
import { compose } from 'redux';
import { injectT } from '../../i18n';


const LogoutProviders = ({ t }) => (
  <OneColumn cssModifier="narrow">
    <div>
      <ul className="vertical-menu">
        <li className="vertical-menu_item"><a href="/logoutFederated" className="login-button btn-google c-button">{t('logoutProviders.federatedLogout')}</a></li>
        <li className="vertical-menu_item"><a href="/logoutSession" className="login-button btn-fb c-button">{t('logoutProviders.localLogout')}</a></li>
      </ul>
    </div>
  </OneColumn>
  );

export default compose(injectT)(LogoutProviders);
