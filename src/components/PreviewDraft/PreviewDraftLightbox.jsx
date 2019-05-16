/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { injectT } from '@ndla/i18n';
import PropTypes from 'prop-types';
import Button from '@ndla/button';
import { spacing } from '@ndla/core';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import isString from 'lodash/isString';
import * as articleApi from '../../modules/article/articleApi';
import * as draftApi from '../../modules/draft/draftApi';
import Lightbox, { closeLightboxButtonStyle, StyledCross } from '../Lightbox';
import PreviewLightboxContent from './PreviewLightboxContent';
import {
  transformArticle,
  transformArticleToApiVersion,
} from '../../util/articleUtil';
import { FormikActionButton } from '../../containers/FormikForm';
import Spinner from '../Spinner';

const twoArticlesCloseButtonStyle = css`
  position: absolute;
  right: 20px;
`;

const StyledPreviewDraft = styled('div')`
  ${p => (p.typeOfPreview === 'preview' ? 'text-align: left;' : '')};
`;

const lightboxContentStyle = typeOfPreview =>
  typeOfPreview !== 'preview'
    ? css`
        padding: 1rem 0;
        width: 98%;
        margin: 0 auto;
        max-width: 100%;
        display: flex;
      `
    : css`
        margin: 1rem 0;
        padding: 1rem 0;
        width: 100%;
        margin-right: auto;
        margin-left: auto;
        max-width: 1024px;
      `;

const closeButtonStyle = typeOfPreview => css`
  ${closeLightboxButtonStyle};
  ${typeOfPreview !== 'preview' ? twoArticlesCloseButtonStyle : null};
  margin-right: 0;
  margin-top: -15px;
`;

const customSpinnerStyle = css`
  display: inline-block;
  margin-right: ${spacing.xsmall};
`;

// Transform article if title is a string. If not it's probably an api compatible article
function toApiVersion(article) {
  return isString(article.title)
    ? transformArticleToApiVersion(article)
    : article;
}

const defaultState = {
  firstArticle: undefined,
  secondArticle: undefined,
  previewLanguage: undefined,
  showPreview: false,
  loading: false,
};

class PreviewDraftLightbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = defaultState;
    this.openPreview = this.openPreview.bind(this);
    this.onClosePreview = this.onClosePreview.bind(this);
    this.previewLanguageArticle = this.previewLanguageArticle.bind(this);
    this.previewProductionArticle = this.previewProductionArticle.bind(this);
    this.onChangePreviewLanguage = this.onChangePreviewLanguage.bind(this);
  }

  onClosePreview() {
    this.setState(defaultState);
  }

  async onChangePreviewLanguage(language) {
    const secondArticle = await this.previewLanguageArticle(language);
    this.setState({
      previewLanguage: language,
      secondArticle,
    });
  }

  async openPreview() {
    const { getArticle, typeOfPreview } = this.props;

    const article = toApiVersion(getArticle(true));
    const secondArticleLanguage = article.supportedLanguages.find(
      l => l !== article.language,
    );

    const types = {
      previewProductionArticle: this.previewProductionArticle,
      previewLanguageArticle: () =>
        this.previewLanguageArticle(secondArticleLanguage),
    };
    this.setState({ loading: true });
    const firstArticle = await articleApi.getPreviewArticle(
      article,
      article.language,
    );

    const secondArticle = types[typeOfPreview]
      ? await types[typeOfPreview]()
      : undefined;

    this.setState({
      firstArticle: transformArticle(firstArticle),
      secondArticle,
      showPreview: true,
      previewLanguage: secondArticleLanguage,
      loading: false,
    });
  }

  async previewProductionArticle() {
    const { getArticle } = this.props;
    const { id, language } = getArticle(true);
    const article = await articleApi.getArticleFromArticleConverter(
      id,
      language,
    );
    return transformArticle(article);
  }

  async previewLanguageArticle(language = undefined) {
    const { getArticle } = this.props;
    const originalArticle = toApiVersion(getArticle(true));
    const draftOtherLanguage = await draftApi.fetchDraft(
      originalArticle.id,
      language,
    );
    const article = await articleApi.getPreviewArticle(
      draftOtherLanguage,
      language,
    );
    return transformArticle(article);
  }

  render() {
    const {
      firstArticle,
      showPreview,
      secondArticle,
      previewLanguage,
      loading,
    } = this.state;
    const { label, typeOfPreview, t } = this.props;

    if (!showPreview) {
      return (
        <FormikActionButton
          outline
          onClick={this.openPreview}
          disabled={loading}>
          {loading && <Spinner appearance="small" css={customSpinnerStyle} />}
          {t(`form.${typeOfPreview}.button`)}
        </FormikActionButton>
      );
    }

    const closeButton = (
      <Button
        css={closeButtonStyle(typeOfPreview)}
        stripped
        onClick={this.onClosePreview}>
        <StyledCross />
      </Button>
    );

    return (
      <StyledPreviewDraft typeOfPreview={typeOfPreview}>
        <Lightbox
          display
          onClose={this.onClosePreview}
          closeButton={closeButton}
          contentCss={lightboxContentStyle(typeOfPreview)}>
          <PreviewLightboxContent
            firstArticle={firstArticle}
            secondArticle={secondArticle}
            label={label}
            typeOfPreview={typeOfPreview}
            onChangePreviewLanguage={this.onChangePreviewLanguage}
            previewLanguage={previewLanguage}
          />
        </Lightbox>
      </StyledPreviewDraft>
    );
  }
}

export default injectT(PreviewDraftLightbox);

PreviewDraftLightbox.propTypes = {
  getArticle: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  typeOfPreview: PropTypes.oneOf([
    'preview',
    'previewProductionArticle',
    'previewLanguageArticle',
  ]),
};
