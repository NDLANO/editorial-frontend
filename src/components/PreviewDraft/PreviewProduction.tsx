/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { ArticleType } from '../../interfaces';
import PreviewDraft from './PreviewDraft';
import StyledPreviewTwoArticles from './StyledPreviewTwoArticles';

interface Props {
  firstEntity: ArticleType;
  secondEntity: ArticleType;
  contentType?: string;
  label: string;
  previewLanguage: string;
}

const PreviewProduction = ({
  firstEntity,
  secondEntity,
  label,
  previewLanguage,
  contentType,
}: Props) => {
  const { t } = useTranslation();
  return (
    <Fragment>
      <StyledPreviewTwoArticles>
        <h2 className="u-4/6@desktop u-push-1/6@desktop">
          {t('form.previewProductionArticle.draft')}
        </h2>
        <PreviewDraft
          article={firstEntity}
          label={label}
          contentType={contentType}
          language={previewLanguage}
        />
      </StyledPreviewTwoArticles>
      <StyledPreviewTwoArticles>
        <h2 className="u-4/6@desktop u-push-1/6@desktop">
          {t('form.previewProductionArticle.article')}
        </h2>
        <PreviewDraft
          article={secondEntity}
          label={label}
          contentType={contentType}
          language={previewLanguage}
        />
      </StyledPreviewTwoArticles>
    </Fragment>
  );
};

export default PreviewProduction;
