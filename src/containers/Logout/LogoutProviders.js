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
import { toLogoutFederated, toLogoutSession } from '../../util/routeHelpers';

const LogoutProvidersContainer = styled('div')`
  margin-top: 3em;
  max-width: 400px;

  & p {
    margin: 1.44em 0;
  }
`;
const LogoutProvidersOrParagraph = styled('p')`
  text-align: center;
  font-weight: 600;
`;

const LogoutProviders = ({ t }) => (
  <LogoutProvidersContainer>
    <Link to={toLogoutSession()} className="c-button c-button--outline">
      {t('logoutProviders.localLogout')}
    </Link>
    <LogoutProvidersOrParagraph>
      {t('logoutProviders.or')}
    </LogoutProvidersOrParagraph>
    <Link to={toLogoutFederated()} className="c-button c-button--outline">
      {t('logoutProviders.federatedLogout')}
    </Link>
    <p>{t('logoutProviders.description')}</p>
  </LogoutProvidersContainer>
);

export default injectT(LogoutProviders);
