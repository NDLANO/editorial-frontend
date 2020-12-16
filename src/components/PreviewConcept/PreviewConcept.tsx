/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { FC } from 'react';
import { injectT, tType } from '@ndla/i18n';
import styled from '@emotion/styled';
import Concept from './Concept';
import { StyledPreviewHeader } from '../PreviewDraft/PreviewLanguage';
import StyledPreviewTwoArticles from '../PreviewDraft/StyledPreviewTwoArticles';
import { Concept as ConceptType } from '../SlateEditor/editorTypes';

const StyledPreviewConcept = styled('div')`
  display: inline-block;
  width: 100%;
`;

interface Props {
  firstConcept: ConceptType;
  secondConcept: ConceptType;
  onChangePreviewLanguage: Function;
  previewLanguage: string;
}

const PreviewConcept: FC<Props & tType> = ({
  t,
  firstConcept,
  secondConcept,
  onChangePreviewLanguage,
  previewLanguage,
}) => {
  return (
    <StyledPreviewConcept>
      <StyledPreviewTwoArticles>
        <StyledPreviewHeader>
          <h2 className="u-4/6@desktop u-push-1/6@desktop">
            {t('form.previewLanguageArticle.title', {
              language: t(`language.${firstConcept.language}`).toLowerCase(),
            })}
          </h2>
        </StyledPreviewHeader>
        <Concept concept={firstConcept} />
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
            {firstConcept.supportedLanguages.map(language => (
              <option key={language} value={language}>
                {t(`language.${language}`)}
              </option>
            ))}
          </select>
        </StyledPreviewHeader>
        <Concept concept={secondConcept} />
      </StyledPreviewTwoArticles>
    </StyledPreviewConcept>
  );
};

export default injectT(PreviewConcept);
