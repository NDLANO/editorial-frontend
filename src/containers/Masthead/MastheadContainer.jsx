/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Masthead, MastheadItem, SiteNav, SiteNavItem, Logo } from 'ndla-ui';
import { toSearch, toLogin, toLogout } from '../../routes';

const AuthSiteNavItem = ({ t, name, authenticated }) => {
  if (authenticated) {
    return (
      <SiteNavItem to={toLogout()}>
        {t('siteNav.logout', { name })}
      </SiteNavItem>
    );
  }
  return (
    <SiteNavItem to={toLogin()}>
      {t('siteNav.login')}
    </SiteNavItem>
  );
};

AuthSiteNavItem.propTypes = {
  t: PropTypes.func.isRequired,
  authenticated: PropTypes.bool.isRequired,
  name: PropTypes.string,
};

const MastheadContainer = ({ t, authenticated, userName }) =>
  <Masthead>
    <MastheadItem left>
      <Logo to="/" altText="Nasjonal digital læringsarena" />
    </MastheadItem>
    <MastheadItem right>
      <SiteNav>
        <SiteNavItem to={toSearch()}>
          {t('siteNav.search')}
        </SiteNavItem>
        <AuthSiteNavItem t={t} authenticated={authenticated} name={userName}>
          {t('siteNav.search')}
        </AuthSiteNavItem>
      </SiteNav>
    </MastheadItem>
  </Masthead>;

MastheadContainer.propTypes = {
  params: PropTypes.shape({
    subjectId: PropTypes.string,
    topicId: PropTypes.string,
  }).isRequired,
  t: PropTypes.func.isRequired,
  authenticated: PropTypes.bool.isRequired,
  userName: PropTypes.string,
};

export default MastheadContainer;
