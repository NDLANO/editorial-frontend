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
import { toSearch } from '../../routes';


const MastheadContainer = ({ t }) => (
  <Masthead>
    <MastheadItem left>
      <Logo to="/" altText="Nasjonal digital læringsarena" />
    </MastheadItem>
    <MastheadItem right>
      <SiteNav>
        <SiteNavItem to={toSearch()}>
          {t('siteNav.search')}
        </SiteNavItem>
      </SiteNav>
    </MastheadItem>
  </Masthead>
);

MastheadContainer.propTypes = {
  params: PropTypes.shape({
    subjectId: PropTypes.string,
    topicId: PropTypes.string,
  }).isRequired,
  t: PropTypes.func.isRequired,
};


export default MastheadContainer;
