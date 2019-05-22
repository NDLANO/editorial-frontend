/**
 * Copyright (C) 2017 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { injectT } from '@ndla/i18n';
import styled from '@emotion/styled';
import { toLogoutSession } from '../../util/routeHelpers';

const LogoutProvidersContainer = styled('div')`
  margin-top: 3em;
  max-width: 400px;
  & p {
    margin: 1.44em 0;
  }
`;

const LogoutProviders = ({ t }) => (
  <LogoutProvidersContainer>
    <Link to={toLogoutSession()} className="c-button c-button--outline">
      {t('logoutProviders.localLogout')}
    </Link>
  </LogoutProvidersContainer>
);

export default injectT(LogoutProviders);
