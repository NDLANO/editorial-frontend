/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { colors } from '@ndla/core';
import { IMultiSearchSummary } from '@ndla/types-search-api';
import { resourceToLinkProps } from '../../../../util/resourceHelpers';
import { StyledOtherLink } from '../form/StyledSearchComponents';

const supported = ['en', 'nb', 'nn'];

interface Props {
  content: IMultiSearchSummary;
  language: string;
  contentType?: string;
}

const StyledAnchor = styled.a`
  &:any-link {
    color: ${colors.brand.primary};
  }
`;

const StyledLink = StyledAnchor.withComponent(Link);

const SearchContentLanguage = ({ language, content, contentType }: Props) => {
  const { t } = useTranslation();
  if (!supported.includes(language) || content.title.language === language) {
    return null;
  }
  const linkProps = resourceToLinkProps(content, contentType, language);

  const link =
    linkProps && linkProps.href ? (
      <StyledAnchor {...linkProps}>{t(`language.${language}`)}</StyledAnchor>
    ) : (
      <StyledLink to={linkProps.to ?? ''}>{t(`language.${language}`)}</StyledLink>
    );
  return <StyledOtherLink>{link}</StyledOtherLink>;
};

export default SearchContentLanguage;
