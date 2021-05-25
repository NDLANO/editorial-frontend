/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { colors } from '@ndla/core';
import { classes } from './ResourceGroup';
import { toEditArticle, toLearningpathFull } from '../../../util/routeHelpers';

const StyledH1 = styled.h1`
  font-style: ${props => !props.isVisible && 'italic'};
  color: ${props => (!props.isVisible ? colors.brand.grey : colors.brand.primary)};
`;

const ResourceItemLink = ({ contentType, contentUri, locale, name, isVisible = true }) => {
  const linkTo = contentUri && contentUri.split(':').pop();

  if (linkTo) {
    if (contentType === 'learning-path') {
      const linkProps = {
        href: toLearningpathFull(linkTo, locale),
        target: '_blank',
        rel: 'noopener noreferrer',
      };
      return (
        <StyledH1 isVisible={isVisible} {...classes('title')}>
          <a {...linkProps}>{name}</a>
        </StyledH1>
      );
    }
    return (
      <Link to={toEditArticle(linkTo, contentType)} target="_blank" rel="noopener noreferrer">
        <StyledH1 isVisible={isVisible} {...classes('title')}>
          {name}
        </StyledH1>
      </Link>
    );
  }
  return (
    <StyledH1 isVisible={isVisible} {...classes('title')}>
      {name}
    </StyledH1>
  );
};

ResourceItemLink.propTypes = {
  contentType: PropTypes.string.isRequired,
  contentUri: PropTypes.string,
  locale: PropTypes.string.isRequired,
  name: PropTypes.string,
  isVisible: PropTypes.bool,
};

export default ResourceItemLink;
