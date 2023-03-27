/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { colors, mq, breakpoints } from '@ndla/core';
import { toEditArticle, toLearningpathFull } from '../../util/routeHelpers';

const StyledH1 = styled.h1<{ isVisible?: boolean }>`
  font-style: ${(props) => !props.isVisible && 'italic'};
  color: ${(props) => (!props.isVisible ? colors.brand.grey : colors.brand.primary)};
  text-transform: none;
  letter-spacing: 0;
  margin: 0;
  display: inline;
  font-size: 18px;
  font-size: 1rem;
  line-height: 1.44444;
  font-weight: 500;
  ${mq.range({ from: breakpoints.desktop })} {
    font-size: 20px;
    font-size: 1.11111rem;
    line-height: 1.3;
  }
`;

interface Props {
  contentType?: string;
  contentUri?: string;
  locale: string;
  name?: string;
  isVisible?: boolean;
}

const ResourceItemLink = ({ contentType, contentUri, locale, name, isVisible = true }: Props) => {
  const linkTo = contentUri && contentUri.split(':').pop();

  if (linkTo) {
    if (contentType === 'learning-path') {
      const linkProps = {
        href: toLearningpathFull(parseInt(linkTo), locale),
        target: '_blank',
        rel: 'noopener noreferrer',
      };
      return (
        <StyledH1 isVisible={isVisible}>
          <a {...linkProps}>{name}</a>
        </StyledH1>
      );
    }
    return (
      <Link
        to={toEditArticle(parseInt(linkTo), contentType!)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <StyledH1 isVisible={isVisible}>{name}</StyledH1>
      </Link>
    );
  }
  return <StyledH1 isVisible={isVisible}>{name}</StyledH1>;
};

export default ResourceItemLink;
