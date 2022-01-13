/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ArticleConverterApiType } from '../../modules/article/articleApiInterfaces';
import { ConceptPreviewType } from '../PreviewConcept/PreviewConceptLightbox';
import StyledPreviewTwoArticles from './StyledPreviewTwoArticles';

const StyledPreview = styled.div`
  display: inline-block;
  width: 100%;
`;

interface Props {
  firstEntity: ArticleConverterApiType;
  secondEntity: ArticleConverterApiType;
  contentType?: string;
  label: string;
  previewLanguage: string;
  getEntityPreview: (
    entity: ArticleConverterApiType | ConceptPreviewType,
    label: string,
    contentType?: string,
  ) => ReactNode;
}

const PreviewProduction = ({
  firstEntity,
  secondEntity,
  label,
  previewLanguage,
  contentType,
  getEntityPreview,
}: Props) => {
  const { t } = useTranslation();
  return (
    <StyledPreview>
      <StyledPreviewTwoArticles>
        <h2 className="u-4/6@desktop u-push-1/6@desktop">
          {t('form.previewProductionArticle.current')}
        </h2>
        {getEntityPreview(firstEntity, label, contentType)}
      </StyledPreviewTwoArticles>
      <StyledPreviewTwoArticles>
        <h2 className="u-4/6@desktop u-push-1/6@desktop">
          {t('form.previewProductionArticle.version', { revision: secondEntity.revision })}
        </h2>
        {getEntityPreview(secondEntity, label, contentType)}
      </StyledPreviewTwoArticles>
    </StyledPreview>
  );
};

export default PreviewProduction;
