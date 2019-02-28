/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { spacing } from '@ndla/core';
import styled from 'react-emotion';

const StyleMetaInformation = styled.div`
  display: inline-block;
  margin-left: ${spacing.normal};
}
`;

const StyledStrong = styled.strong`
  display: block;
`;

const MetaInformation = ({ title, copyright, translations, action }) => (
  <StyleMetaInformation>
    <StyledStrong>{title ? translations.title : ''}</StyledStrong>
    <span>{title}</span>
    <StyledStrong>{copyright ? translations.copyright : ''}</StyledStrong>
    <span>{copyright}</span>
    {action || null}
  </StyleMetaInformation>
);

MetaInformation.propTypes = {
  title: PropTypes.string,
  copyright: PropTypes.string,
  translations: PropTypes.shape({
    title: PropTypes.string.isRequired,
    copyright: PropTypes.string.isRequired,
  }),
  action: PropTypes.node,
};

export default MetaInformation;
