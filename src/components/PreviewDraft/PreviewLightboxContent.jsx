/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import PreviewDraft from './PreviewDraft';
import { classes } from './PreviewDraftLightbox';
import PreviewProduction from './PreviewProduction';
import PreviewLanguage from './PreviewLanguage';

const PreviewLightboxContent = props => {
  const { firstArticle, label, typeOfPreview, contentType } = props;
  switch (typeOfPreview) {
    case 'preview':
      return (
        <div {...classes('article')}>
          <PreviewDraft
            article={firstArticle}
            label={label}
            contentType={contentType}
          />
        </div>
      );
    case 'previewProductionArticle':
      return <PreviewProduction {...props} />;
    case 'previewLanguageArticle':
      return <PreviewLanguage {...props} />;
    default:
      return null;
  }
};

PreviewLightboxContent.propTypes = {
  firstArticle: PropTypes.shape({
    id: PropTypes.number,
    content: PropTypes.string,
    title: PropTypes.string,
    introduction: PropTypes.string,
  }),
  second: PropTypes.shape({
    id: PropTypes.number,
    content: PropTypes.string,
    title: PropTypes.string,
    introduction: PropTypes.string,
  }),
  typeOfPreview: PropTypes.oneOf([
    'preview',
    'previewProductionArticle',
    'previewLanguageArticle',
  ]),
  contentType: PropTypes.string,
  label: PropTypes.string.isRequired,
  onChangePreviewLanguage: PropTypes.func.isRequired,
  previewLanguage: PropTypes.string,
};

export default PreviewLightboxContent;
