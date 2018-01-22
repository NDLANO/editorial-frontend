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
import BEMHelper from 'react-bem-helper';


import config from '../../config';

export const classes = new BEMHelper({
  name: 'welcome',
  prefix: 'c-',
});

const assets = config.isProduction
  ? require('../../../htdocs/assets/assets') // eslint-disable-line import/no-unresolved
  : require('../../../server/developmentAssets');

export const WelcomePage = ({ t }) => (
  <OneColumn>
    <div {...classes('header')}>
      <span{...classes('header-text')}>Retningslinjer</span>
      <img {...classes('header-image')} src={`/assets/${assets['welcome-image.jpg']}`} alt="illustration"/>
    </div>
    
  </OneColumn>
);

WelcomePage.propTypes = {};

export default injectT(WelcomePage);
