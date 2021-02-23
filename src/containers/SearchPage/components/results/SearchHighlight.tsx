/*
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { injectT, tType } from '@ndla/i18n';
import styled from '@emotion/styled';
import { fonts, spacing } from '@ndla/core';
import { ContentResultType } from '../../../../interfaces';

interface Props {
  content: ContentResultType;
  locale: string;
}

const StyledHeading = styled.p`
  font-size: 0.7rem;
  font-weight: ${fonts.weight.semibold};
  margin-top: ${spacing.xsmall};
  margin-bottom: 0;
`;

const StyledHighlights = styled.p`
  font-size: 0.7rem;
  margin-top: 0;
  margin-bottom: 0;
`;

const SearchHighlight: React.FC<Props & tType> = ({ content, locale, t }) => {
  if (content.highlights === undefined || !content.highlights.length) {
    return null;
  }

  const highlightsInLocale = content.highlights.filter(
    highlight => highlight.field.split('.')[1] === locale,
  );

  const selectHighlights = (field: string) =>
    highlightsInLocale.find(highlight => highlight.field.split('.')[0] === field)?.matches;

  const selectedHighlights = highlightsInLocale.length
    ? selectHighlights('content') ||
      selectHighlights('metaDescription') ||
      highlightsInLocale[0].matches
    : content.highlights[0].matches;

  return (
    <>
      <StyledHeading>{t('searchPage.highlights')}</StyledHeading>
      <StyledHighlights
        dangerouslySetInnerHTML={{
          __html: selectedHighlights.reduce((acc, next) => {
            acc += next + ' [...] ';
            return acc;
          }, ''),
        }}
      />
    </>
  );
};

export default injectT(SearchHighlight);
