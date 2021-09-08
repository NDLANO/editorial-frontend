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

export const StyledLanguageWrapper = styled.div`
  padding-left: ${spacing.small};
  margin: 0;
  display: flex;
  align-items: center;
`;

const getTaxonomyPathsFromTaxonomy = (taxonomy: object, articleId: number) => {
  const taxonomyObjects = Object.values(taxonomy || {});
  const flattenedObjects = [].concat.apply([], taxonomyObjects);
  //@ts-ignore
  const nestedTaxonomyPaths = flattenedObjects.map(rt => rt?.paths);
  const flattenedPaths = [].concat.apply([], nestedTaxonomyPaths);
  //@ts-ignore
  return flattenedPaths.concat(`/article/${articleId}`);
};

const HeaderWithLanguage = ({
  content,
  isSubmitting,
  noStatus,
  setTranslateOnContinue,
  translateToNN,
  type,
  values,
  formIsDirty = false,
  ...rest
}: Props) => {
  const { t } = useTranslation();
  const { supportedLanguages, articleType } = values;
  const { id, title, status, language } = content;

  const isNewLanguage = !!id && !supportedLanguages.includes(language);
  const statusText = status?.current ? t(`form.status.${status.current.toLowerCase()}`) : '';
  const published = status?.current === 'PUBLISHED' || status?.other?.includes('PUBLISHED');
  const multiType = articleType ? articleType : type;
  const isArticle = multiType === 'standard' || multiType === 'topic-article';

  const taxonomyPaths = isArticle ? getTaxonomyPathsFromTaxonomy(content?.taxonomy, id) : [];

  return (
    <header>
      {/* @ts-ignore */}
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
          values={values}
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

interface Props {
  content: {
    current: object;
    id: number;
    language: string;
    status: {
      current: string;
      other: string[];
    };
    title: string;
    taxonomy: object;
  };
  editUrl: (url: string) => string;
  getEntity: Function;
  isSubmitting: boolean;
  noStatus: boolean;
  setTranslateOnContinue: (translateOnContinue: boolean) => void;
  type:
    | 'image'
    | 'audio'
    | 'iframe'
    | 'topic-article'
    | 'standard'
    | 'concept'
    | 'podcast'
    | 'podcast-series';
  translateToNN: () => void;
  values: {
    id?: number;
    articleType: string;
    language: string;
    supportedLanguages: string[];
  };
  formIsDirty?: boolean;
}

export default HeaderWithLanguage;
