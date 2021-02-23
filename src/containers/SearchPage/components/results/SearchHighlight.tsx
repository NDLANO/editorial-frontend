import React from 'react';
import { injectT, tType } from '@ndla/i18n';
import styled from '@emotion/styled';
import { fonts, spacing } from '@ndla/core';

interface Props {
  highlights: [
    {
      field: string;
      matches: string[];
    },
  ];
  content: {
    title: {
      title: string;
      language: string;
    };
  };
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

const SearchHighlight: React.FC<Props & tType> = ({ highlights, content, t }) => {
  const selectedLanguageHighlights =
    highlights.find(highlight => highlight.field === 'content.' + content.title.language)
      ?.matches ||
    highlights.find(highlight => highlight.field.split('.')[1] === content.title.language)?.matches;

  return selectedLanguageHighlights ? (
    <>
      <StyledHeading>{t('searchPage.highlights')}</StyledHeading>
      <StyledHighlights
        dangerouslySetInnerHTML={{
          __html: selectedLanguageHighlights?.reduce((acc, next) => {
            acc += next + ' [...] ';
            return acc;
          }, ''),
        }}
      />
    </>
  ) : null;
};

export default injectT(SearchHighlight);
