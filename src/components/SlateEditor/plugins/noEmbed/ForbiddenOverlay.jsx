/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import BEMHelper from 'react-bem-helper';

const classes = new BEMHelper({
  name: 'content',
  prefix: 'c-',
});

const ForbiddenOverlay = ({ text, t }) =>
  <div>
    <div {...classes('forbidden-overlay')} />
    <div {...classes('forbidden-sign')} />
    <strong {...classes('forbidden-text')}>
      {text || t('forbiddenOverlay.deleteEmbedOnSave')}
    </strong>
  </div>;

ForbiddenOverlay.propTypes = {
  text: PropTypes.string,
};

export default injectT(ForbiddenOverlay);
