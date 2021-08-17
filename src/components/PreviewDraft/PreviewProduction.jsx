/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import PreviewDraft from './PreviewDraft';
import StyledPreviewTwoArticles from './StyledPreviewTwoArticles';

const PreviewProduction = props => {
  const { t } = useTranslation();
  const { firstEntity, secondEntity, label, previewLanguage, contentType } = props;
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

PreviewProduction.propTypes = {
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
  contentType: PropTypes.string,
  label: PropTypes.string.isRequired,
  previewLanguage: PropTypes.string.isRequired,
};

export default PreviewProduction;
