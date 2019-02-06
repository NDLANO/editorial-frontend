/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import PreviewDraft from './PreviewDraft';
import PreviewProduction from './PreviewProduction';
import PreviewLanguage from './PreviewLanguage';

const StyledPreviewSignleArticle = styled('div')`
  & .c-article {
    padding-top: 0;
    margin-top: 20px;
  }
`;

const PreviewLightboxContent = props => {
  const { firstArticle, label, typeOfPreview } = props;
  switch (typeOfPreview) {
    case 'preview':
      return (
        <StyledPreviewSignleArticle>
          <PreviewDraft article={firstArticle} label={label} />
        </StyledPreviewSignleArticle>
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
  label: PropTypes.string.isRequired,
  onChangePreviewLanguage: PropTypes.func.isRequired,
  previewLanguage: PropTypes.string,
};

export default PreviewLightboxContent;
