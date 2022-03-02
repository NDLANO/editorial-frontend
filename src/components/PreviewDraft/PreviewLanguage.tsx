/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { IConcept } from '@ndla/types-concept-api';
import StyledPreviewTwoArticles from './StyledPreviewTwoArticles';
import { createGuard } from '../../util/guards';
import { ArticleConverterApiType } from '../../modules/article/articleApiInterfaces';

export const StyledPreviewHeader = styled.div`
  min-height: 6rem;
`;

const StyledPreview = styled.div`
  display: inline-block;
  width: 100%;
`;

interface Props {
  label: string;
  contentType?: string;
  firstEntity: ArticleConverterApiType | IConcept;
  secondEntity: ArticleConverterApiType | IConcept;
  previewLanguage: string;
  onChangePreviewLanguage(language: string): void;
  getEntityPreview: (
    entity: ArticleConverterApiType | IConcept,
    label: string,
    contentType?: string,
  ) => ReactNode;
}

const isConceptApiType = createGuard<IConcept>('articleIds');

const PreviewLanguage = ({
  firstEntity,
  secondEntity,
  label,
  contentType,
  onChangePreviewLanguage,
  previewLanguage,
  getEntityPreview,
}: Props) => {
  const { t } = useTranslation();
  const language = isConceptApiType(firstEntity)
    ? firstEntity.content?.language
    : firstEntity.language;
  return (
    <StyledPreview>
      <StyledPreviewTwoArticles>
        <StyledPreviewHeader>
          <h2 className="u-4/6@desktop u-push-1/6@desktop">
            {t('form.previewLanguageArticle.title', {
              language: t(`language.${language}`).toLowerCase(),
            })}
          </h2>
        </StyledPreviewHeader>
        {getEntityPreview(firstEntity, label, contentType)}
      </StyledPreviewTwoArticles>
      <StyledPreviewTwoArticles>
        <StyledPreviewHeader>
          <h2 className="u-4/6@desktop u-push-1/6@desktop">
            {t('form.previewLanguageArticle.title', {
              language: t(`language.${previewLanguage}`).toLowerCase(),
            })}
          </h2>
          <select
            className="u-4/6@desktop u-push-1/6@desktop"
            onChange={evt => onChangePreviewLanguage(evt.target.value)}
            value={previewLanguage}>
            {secondEntity.supportedLanguages.map(language => (
              <option key={language} value={language}>
                {t(`language.${language}`)}
              </option>
            ))}
          </select>
        </StyledPreviewHeader>
        {getEntityPreview(secondEntity, label, contentType)}
      </StyledPreviewTwoArticles>
    </StyledPreview>
  );
};

export default PreviewLanguage;
