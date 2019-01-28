/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import PreviewDraft from './PreviewDraft';
import StyledPreviewTwoArticles from './StyledPreviewTwoArticles';

const PreviewProduction = props => {
  const { firstArticle, secondArticle, label, contentType, t } = props;
  return (
    <Fragment>
      <StyledPreviewTwoArticles>
        <h2 className="u-4/6@desktop u-push-1/6@desktop">
          {t('form.previewProductionArticle.draft')}
        </h2>
        <PreviewDraft
          article={firstArticle}
          label={label}
          contentType={contentType}
        />
      </StyledPreviewTwoArticles>
      <StyledPreviewTwoArticles>
        <h2 className="u-4/6@desktop u-push-1/6@desktop">
          {t('form.previewProductionArticle.article')}
        </h2>
        <PreviewDraft
          article={secondArticle}
          label={label}
          contentType={contentType}
        />
      </StyledPreviewTwoArticles>
    </Fragment>
  );
};

PreviewProduction.propTypes = {
  firstArticle: PropTypes.shape({
    id: PropTypes.number,
    content: PropTypes.string,
    title: PropTypes.string,
    introduction: PropTypes.string,
  }),
  secondArticle: PropTypes.shape({
    id: PropTypes.number,
    content: PropTypes.string,
    title: PropTypes.string,
    introduction: PropTypes.string,
  }),
  contentType: PropTypes.string,
  label: PropTypes.string.isRequired,
};

export default injectT(PreviewProduction);
