/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { fonts } from '@ndla/core';
import Tooltip from '@ndla/tooltip';
import { IMultiSearchSummary } from '@ndla/types-backend/search-api';

interface Props {
  content: IMultiSearchSummary;
  locale: string;
}

const StyledHeading = styled.p`
  font-weight: ${fonts.weight.semibold};
  margin-top: 0;
  margin-bottom: 0;
`;

const StyledHighlights = styled.p`
  cursor: help;
  margin-top: 0;
  margin-bottom: 0;
`;

const StyledDiv = styled.div`
  display: inline-block;
`;

const SearchHighlight = ({ content, locale }: Props) => {
  const { t } = useTranslation();
  if (content.highlights === undefined) {
    return null;
  }

  const highlightsInLocale = content.highlights.filter((highlight) => highlight.field.split('.')[1] === locale);

  const highlightsToSearch = highlightsInLocale.length ? highlightsInLocale : content.highlights;

  const selectHighlights = (field: string) =>
    highlightsToSearch.find((highlight) => highlight.field.split('.')[0] === field);

  const selectedHighlights =
    selectHighlights('content') ||
    selectHighlights('embedAttributes') ||
    selectHighlights('tags') ||
    selectHighlights('notes') ||
    selectHighlights('previousVersionsNotes');

  return selectedHighlights ? (
    <StyledDiv>
      <StyledHeading>{t('searchPage.highlights.title')}</StyledHeading>
      <Tooltip tooltip={t(`searchPage.highlights.${selectedHighlights.field.split('.')[0]}`)}>
        <StyledHighlights dangerouslySetInnerHTML={{ __html: selectedHighlights.matches.join(' [...] ') }} />
      </Tooltip>
    </StyledDiv>
  ) : null;
};

export default SearchHighlight;
