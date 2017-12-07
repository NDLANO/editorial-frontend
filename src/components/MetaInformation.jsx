/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';

const classes = new BEMHelper({
  name: 'meta-information',
  prefix: 'c-',
});
const MetaInformation = ({ title, copyright, action, translations }) => (
  <div {...classes()}>
    <strong>{title ? translations.title : ''}</strong>
    <span>{title}</span>
    <strong>{copyright ? translations.copyright : ''}</strong>
    <span>{copyright}</span>
    {action}
  </div>
);

MetaInformation.propTypes = {
  title: PropTypes.string,
  copyright: PropTypes.string,
  action: PropTypes.node,
  translations: PropTypes.shape({
    title: PropTypes.string.isRequired,
    copyright: PropTypes.string.isRequired,
  }),
};

export default MetaInformation;
