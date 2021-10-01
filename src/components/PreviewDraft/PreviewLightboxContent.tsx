/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Spinner from '../Spinner';
import PreviewProduction from './PreviewProduction';
import PreviewLanguage from './PreviewLanguage';
import { ArticleConverterApiType } from '../../modules/article/articleApiInterfaces';
import { ConceptType } from '../../modules/concept/conceptApiInterfaces';
import { ArticleType, TypeOfPreview } from '../../interfaces';

interface StyledProps {
  contentType?: string;
}

const StyledPreviewSingleArticle = styled.div<StyledProps>`
  & .c-article {
    padding-top: 0;
    margin-top: 20px;
  }
`;

interface Props {
  firstEntity: ArticleConverterApiType | ConceptType;
  secondEntity: ArticleConverterApiType | ConceptType;
  loading?: boolean;
  typeOfPreview: TypeOfPreview;
  label: string;
  onChangePreviewLanguage: (language: string) => void;
  previewLanguage: string;
  contentType?: string;
  getEntityPreview: (
    entity: ArticleType | ConceptType,
    label: string,
    contentType?: string,
  ) => React.ReactNode;
}

const isArticleArray = (
  entities: (ArticleConverterApiType | ConceptType)[],
): entities is ArticleConverterApiType[] => {
  return entities.every(e => (e as ArticleConverterApiType).agreementId !== undefined);
};

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

PreviewLightboxContent.propTypes = {
  firstEntity: PropTypes.shape({
    id: PropTypes.number,
    content: PropTypes.string,
    title: PropTypes.string,
    introduction: PropTypes.string,
  }),
  secondEntity: PropTypes.shape({
    id: PropTypes.number,
    content: PropTypes.string,
    title: PropTypes.string,
    introduction: PropTypes.string,
  }),
  loading: PropTypes.bool,
  typeOfPreview: PropTypes.oneOf([
    'preview',
    'previewProductionArticle',
    'previewLanguageArticle',
    'previewVersion',
  ]),
  label: PropTypes.string.isRequired,
  onChangePreviewLanguage: PropTypes.func.isRequired,
  previewLanguage: PropTypes.string,
  contentType: PropTypes.string,
  getEntityPreview: PropTypes.func,
};

export default PreviewLightboxContent;
