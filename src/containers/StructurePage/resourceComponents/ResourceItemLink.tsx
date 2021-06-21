/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { colors } from '@ndla/core';
import { injectT, tType } from '@ndla/i18n';
import { classes } from './ResourceGroup';
import { toEditArticle, toLearningpathFull } from '../../../util/routeHelpers';
import { TaxonomyContentType } from '../../../interfaces';

const StyledH1 = styled.h1<{ isVisible: boolean }>`
  font-style: ${props => !props.isVisible && 'italic'};
  color: ${props => (!props.isVisible ? colors.brand.grey : colors.brand.primary)};
`;

interface Props {
  contentType: string;
  contentUri?: string;
  locale: string;
  name: string;
  isVisible?: boolean;
}

const ResourceItemLink = ({
  contentType,
  contentUri,
  locale,
  name,
  isVisible = true,
  t,
}: Props & tType) => {
  const linkTo = contentUri ? parseInt(contentUri.split(':').pop()!!) : undefined;

  if (linkTo) {
    if (contentType === TaxonomyContentType.LearningPath) {
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

export default injectT(ResourceItemLink);
