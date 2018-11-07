/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { OneColumn } from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import { SearchFolder, LastUsed } from '@ndla/icons/editor';
import BEMHelper from 'react-bem-helper';
import { RightArrow } from '@ndla/icons/action';

export const classes = new BEMHelper({
  name: 'welcome',
  prefix: 'c-',
});

export const WelcomePage = ({ t }) => (
  <OneColumn>
    <div {...classes('header')}>
      <a href="#guidelines" {...classes('header-link')}>
        {t('welcomePage.guidelines')}
        <RightArrow className="c-icon--large" />
      </a>
      <img
        {...classes('header-image')}
        src="/welcome-image.jpg"
        alt="illustration"
      />
    </div>
    <div {...classes('two-column')}>
      <div>
        <div {...classes('column-header')}>
          <LastUsed className="c-icon--medium" />
          <span>{t('welcomePage.lastUsed')}</span>
        </div>
        <span>{t('welcomePage.emptyLastUsed')}</span>
      </div>
      <div>
        <div {...classes('column-header')}>
          <SearchFolder className="c-icon--medium" />
          <span>{t('welcomePage.savedSearch')}</span>
        </div>
        <span>{t('welcomePage.emptySavedSearch')}</span>
      </div>
    </div>
  </OneColumn>
);

WelcomePage.propTypes = {};

export default injectT(WelcomePage);
