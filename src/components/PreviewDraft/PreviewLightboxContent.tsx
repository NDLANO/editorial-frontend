/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from 'react';
import styled from '@emotion/styled';
import Spinner from '../Spinner';
import PreviewProduction from './PreviewProduction';
import PreviewLanguage from './PreviewLanguage';
import { ArticleConverterApiType } from '../../modules/article/articleApiInterfaces';
import { TypeOfPreview } from '../../interfaces';
import { ConceptPreviewType } from '../PreviewConcept/PreviewConceptLightbox';
import { createArrayGuard } from '../../util/guards';

interface StyledProps {
  contentType?: string;
}

const StyledPreviewSingleArticle = styled.div<StyledProps>`
  width: 100%;
  & .c-article {
    padding-top: 0;
    margin-top: 20px;
  }
`;

interface Props {
  firstEntity: ArticleConverterApiType | ConceptPreviewType;
  secondEntity: ArticleConverterApiType | ConceptPreviewType;
  loading?: boolean;
  typeOfPreview: TypeOfPreview;
  label: string;
  onChangePreviewLanguage: (language: string) => void;
  previewLanguage: string;
  contentType?: string;
  getEntityPreview: (
    entity: ArticleConverterApiType | ConceptPreviewType,
    label: string,
    contentType?: string,
  ) => ReactNode;
}

const isArticleArray = createArrayGuard<ArticleConverterApiType>('availability');

const PreviewLightboxContent = ({
  firstEntity,
  secondEntity,
  label,
  typeOfPreview,
  loading,
  contentType,
  getEntityPreview,
  previewLanguage,
  onChangePreviewLanguage,
}: Props) => {
  const entities = [firstEntity, secondEntity];
  if (loading) return <Spinner />;
  if (typeOfPreview === 'preview') {
    return (
      <StyledPreviewSingleArticle contentType={contentType}>
        {getEntityPreview(firstEntity, label, contentType)}
      </StyledPreviewSingleArticle>
    );
  }
  if (
    isArticleArray(entities) &&
    (typeOfPreview === 'previewVersion' || typeOfPreview === 'previewProductionArticle')
  ) {
    return (
      <PreviewProduction
        firstEntity={entities[0]}
        label={label}
        contentType={contentType}
        secondEntity={entities[1]}
        previewLanguage={previewLanguage}
        getEntityPreview={getEntityPreview}
      />
    );
  }
  if (typeOfPreview === 'previewLanguageArticle') {
    return (
      <PreviewLanguage
        label={label}
        contentType={contentType}
        firstEntity={firstEntity}
        secondEntity={secondEntity}
        previewLanguage={previewLanguage}
        onChangePreviewLanguage={onChangePreviewLanguage}
        getEntityPreview={getEntityPreview}
      />
    );
  }
  return null;
};

export default PreviewLightboxContent;
