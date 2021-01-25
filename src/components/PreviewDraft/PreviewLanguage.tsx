/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { FC } from 'react';
import styled from '@emotion/styled';
import { injectT, tType } from '@ndla/i18n';
import StyledPreviewTwoArticles from './StyledPreviewTwoArticles';
import { ArticleType } from '../../interfaces';
import { Concept } from '../SlateEditor/editorTypes';

export const StyledPreviewHeader = styled.div`
  min-height: 6rem;
`;

const StyledPreview = styled.div`
  display: inline-block;
  width: 100%;
`;

interface Props {
  label: string;
  contentType: string;
  firstEntity: ArticleType | Concept;
  secondEntity: ArticleType | Concept;
  previewLanguage: string;
  onChangePreviewLanguage(language: string): void;
  getEntityPreview(entity: ArticleType | Concept, label?: string, contentType?: string): Element;
}

const PreviewLanguage: FC<Props & tType> = props => {
  const {
    firstEntity,
    secondEntity,
    label,
    contentType,
    onChangePreviewLanguage,
    previewLanguage,
    t,
    getEntityPreview,
  } = props;

  return (
    <StyledPreview>
      <StyledPreviewTwoArticles>
        <StyledPreviewHeader>
          <h2 className="u-4/6@desktop u-push-1/6@desktop">
            {t('form.previewLanguageArticle.title', {
              language: t(`language.${firstEntity.language}`).toLowerCase(),
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
            {firstEntity.supportedLanguages.map(language => (
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

export default injectT(PreviewLanguage);
