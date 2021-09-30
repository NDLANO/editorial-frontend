/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { useTranslation } from 'react-i18next';
import HeaderInformation from './HeaderInformation';
import HeaderActions from './HeaderActions';
import { getTaxonomyPathsFromTaxonomy } from './util';

export const StyledLanguageWrapper = styled.div`
  padding-left: ${spacing.small};
  margin: 0;
  display: flex;
  align-items: center;
`;

export interface TaxonomyObject {
  topics?: PathObject[];
  resources?: PathObject[];
}

interface PathObject {
  paths?: string[];
}

interface Props {
  content: {
    current?: object;
    id?: number;
    language?: string;
    status?: {
      current: string;
      other: string[];
    };
    title?: string;
    taxonomy?: TaxonomyObject;
    supportedLanguages?: string[];
  };
  editUrl?: (url: string) => string;
  getEntity?: () => any;
  isSubmitting?: boolean;
  noStatus?: boolean;
  setTranslateOnContinue?: (translateOnContinue: boolean) => void;
  type:
    | 'image'
    | 'audio'
    | 'iframe'
    | 'topic-article'
    | 'standard'
    | 'concept'
    | 'podcast'
    | 'podcast-series';
  translateToNN?: () => void;
  values: {
    id?: number;
    articleType?: string;
    language?: string;
    supportedLanguages?: string[];
  };
  formIsDirty?: boolean;
}

const HeaderWithLanguage = ({
  content,
  isSubmitting,
  noStatus = false,
  setTranslateOnContinue,
  translateToNN,
  type,
  values,
  formIsDirty = false,
  ...rest
}: Props) => {
  const { t, i18n } = useTranslation();
  const { articleType } = values;
  const { id, title, status } = content;

  const language = content.language ?? i18n.language;
  const supportedLanguages = values.supportedLanguages ?? [language];

  const isNewLanguage = !!id && !supportedLanguages.includes(language);
  const statusText = status?.current ? t(`form.status.${status.current.toLowerCase()}`) : '';
  const published = status?.current === 'PUBLISHED' || status?.other?.includes('PUBLISHED');
  const multiType = articleType ?? type;
  const isArticle = multiType === 'standard' || multiType === 'topic-article';

  const taxonomyPaths = isArticle ? getTaxonomyPathsFromTaxonomy(content?.taxonomy, id) : [];

  const safeValues = { ...values, language, supportedLanguages };

  return (
    <header>
      <HeaderInformation
        type={multiType}
        noStatus={noStatus}
        statusText={statusText}
        isNewLanguage={isNewLanguage}
        title={title}
        id={id}
        published={published}
        taxonomyPaths={taxonomyPaths}
        {...rest}
      />
      <StyledLanguageWrapper>
        <HeaderActions
          values={safeValues}
          noStatus={noStatus}
          isNewLanguage={isNewLanguage}
          type={multiType}
          isSubmitting={isSubmitting}
          translateToNN={translateToNN}
          setTranslateOnContinue={setTranslateOnContinue}
          formIsDirty={formIsDirty}
          {...rest}
        />
      </StyledLanguageWrapper>
    </header>
  );
};

export default HeaderWithLanguage;
