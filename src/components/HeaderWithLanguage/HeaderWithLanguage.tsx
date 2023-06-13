/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from 'react';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { IConcept } from '@ndla/types-backend/concept-api';
import { IArticle } from '@ndla/types-backend/draft-api';
import { useTranslation } from 'react-i18next';
import HeaderInformation from './HeaderInformation';
import HeaderActions from './HeaderActions';
import { getTaxonomyPathsFromTaxonomy } from './util';
import { ArticleTaxonomy } from '../../containers/FormikForm/formikDraftHooks';

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
    supportedLanguages?: string[];
    hasRSS?: boolean;
  };
  taxonomy?: ArticleTaxonomy;
  editUrl?: (url: string) => string;
  isSubmitting?: boolean;
  noStatus?: boolean;
  article?: IArticle;
  concept?: IConcept;
  type:
    | 'image'
    | 'audio'
    | 'iframe'
    | 'topic-article'
    | 'standard'
    | 'concept'
    | 'podcast'
    | 'podcast-series'
    | 'frontpage-article';
  values: {
    id?: number;
    articleType?: string;
    language?: string;
    supportedLanguages?: string[];
  };
  expirationDate?: string;
}

const HeaderWithLanguage = ({
  content,
  isSubmitting,
  noStatus = false,
  type,
  values,
  taxonomy,
  article,
  concept,
  expirationDate,
  editUrl,
}: Props) => {
  const { t, i18n } = useTranslation();
  const { articleType } = values;
  const { id, title, status, hasRSS } = content;

  // true by default to disable language deletions until connections are retrieved.
  const [hasConnections, setHasConnections] = useState(true);

  const language = content.language ?? i18n.language;
  const supportedLanguages = values.supportedLanguages ?? [language];

  const isNewLanguage = !!id && !supportedLanguages.includes(language);
  const statusText = status?.current ? t(`form.status.${status.current.toLowerCase()}`) : '';
  const published = status?.current === 'PUBLISHED' || status?.other?.includes('PUBLISHED');
  const multiType = articleType ?? type;
  const isArticle =
    multiType === 'standard' || multiType === 'topic-article' || multiType === 'frontpage-article';
  const responsible = isArticle
    ? article?.responsible?.responsibleId
    : concept?.responsible?.responsibleId;

  const taxonomyPaths = isArticle ? getTaxonomyPathsFromTaxonomy(taxonomy, id) : [];

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
        setHasConnections={setHasConnections}
        expirationDate={expirationDate}
        responsibleId={responsible}
        hasRSS={hasRSS}
      />
      <StyledLanguageWrapper>
        <HeaderActions
          disableDelete={hasConnections && supportedLanguages.length === 1}
          article={article}
          concept={concept}
          values={safeValues}
          noStatus={noStatus}
          isNewLanguage={isNewLanguage}
          type={multiType}
          isSubmitting={isSubmitting}
          editUrl={editUrl}
        />
      </StyledLanguageWrapper>
    </header>
  );
};

export default HeaderWithLanguage;
