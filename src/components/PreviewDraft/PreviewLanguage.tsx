/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment, FC } from 'react';
import styled from '@emotion/styled';
import { injectT } from '@ndla/i18n';
import PreviewDraft from './PreviewDraft';
import StyledPreviewTwoArticles from './StyledPreviewTwoArticles';
import { ArticleType, TranslateType } from '../../interfaces';

const StyledPreviewHeader = styled.div`
  min-height: 6rem;
`;

interface Props {
  label: string;
  contentType: string;
  firstArticle: ArticleType;
  secondArticle: ArticleType;
  previewLanguage: string;
  onChangePreviewLanguage(language: string): void;
  t: TranslateType;
}

const PreviewLanguage: FC<Props> = props => {
  const {
    firstArticle,
    secondArticle,
    label,
    contentType,
    onChangePreviewLanguage,
    previewLanguage,
    t,
  } = props;
  return (
    <Fragment>
      <StyledPreviewTwoArticles>
        <StyledPreviewHeader>
          <h2 className="u-4/6@desktop u-push-1/6@desktop">
            {t('form.previewLanguageArticle.title', {
              language: t(`language.${firstArticle.language}`).toLowerCase(),
            })}
          </h2>
        </StyledPreviewHeader>
        <PreviewDraft
          article={firstArticle}
          label={label}
          contentType={contentType}
        />
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
            {firstArticle.supportedLanguages.map(language => (
              <option key={language} value={language}>
                {t(`language.${language}`)}
              </option>
            ))}
          </select>
        </StyledPreviewHeader>
        <PreviewDraft
          article={secondArticle}
          label={label}
          contentType={contentType}
        />
      </StyledPreviewTwoArticles>
    </Fragment>
  );
};

export default injectT(PreviewLanguage);
