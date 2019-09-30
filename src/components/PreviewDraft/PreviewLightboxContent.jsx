/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import PreviewDraft from './PreviewDraft';
import PreviewProduction from './PreviewProduction';
import PreviewLanguage from './PreviewLanguage';
import Spinner from '../Spinner';

const StyledPreviewSingleArticle = styled('div')`
  & .c-article {
    padding-top: 0;
    margin-top: 20px;
  }
`;

const PreviewLightboxContent = props => {
  const { firstArticle, label, typeOfPreview, loading } = props;
  if (loading) return <Spinner />;
  switch (typeOfPreview) {
    case 'preview':
      return (
        <StyledPreviewSingleArticle>
          <PreviewDraft article={firstArticle} label={label} />
        </StyledPreviewSingleArticle>
      );
    case 'previewVersion':
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
  loading: PropTypes.bool,
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
