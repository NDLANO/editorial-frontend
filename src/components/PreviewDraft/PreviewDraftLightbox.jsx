/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import Button from '@ndla/button';
import { injectT } from '@ndla/i18n';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import * as articleApi from '../../modules/article/articleApi';
import * as draftApi from '../../modules/draft/draftApi';
import Lightbox from '../Lightbox';
import PreviewLightboxContent from './PreviewLightboxContent';
import {
  transformArticle,
  transformArticleToApiVersion,
} from '../../util/articleUtil';

export const classes = new BEMHelper({
  name: 'preview-draft',
  prefix: 'c-',
});

const defaultState = {
  firstArticle: undefined,
  secondArticle: undefined,
  previewLanguage: undefined,
  showPreview: false,
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

    const draft = getArticle();
    const originalArticle = transformArticleToApiVersion(draft);

    const secondArticleLanguage = originalArticle.supportedLanguages.find(
      l => l !== draft.language,
    );
    const types = {
      previewProductionArticle: this.previewProductionArticle,
      previewLanguageArticle: () =>
        this.previewLanguageArticle(secondArticleLanguage),
    };

    const firstArticle = await articleApi.getPreviewArticle(
      originalArticle,
      originalArticle.language,
    );

    const secondArticle = types[typeOfPreview]
      ? await types[typeOfPreview]()
      : undefined;

    this.setState({
      firstArticle: transformArticle(firstArticle, originalArticle.language),
      secondArticle,
      showPreview: true,
      previewLanguage: secondArticleLanguage,
    });
  }

  async previewProductionArticle() {
    const { getArticle } = this.props;
    const draft = getArticle();
    const originalArticle = transformArticleToApiVersion(draft);
    const article = await articleApi.getArticleFromArticleConverter(
      originalArticle.id,
      originalArticle.language,
    );
    return transformArticle(article, originalArticle.language);
  }

  async previewLanguageArticle(language = undefined) {
    const { getArticle } = this.props;
    const originalArticle = transformArticleToApiVersion(getArticle());
    const draftOtherLanguage = await draftApi.fetchDraft(
      originalArticle.id,
      language,
    );
    const article = await articleApi.getPreviewArticle(
      draftOtherLanguage,
      language,
    );
    return transformArticle(article, language);
  }

  render() {
    const {
      firstArticle,
      showPreview,
      secondArticle,
      previewLanguage,
    } = this.state;
    const { label, contentType, typeOfPreview, t } = this.props;

    if (!showPreview) {
      return (
        <Button {...classes('button')} outline onClick={this.openPreview}>
          {t(`form.${typeOfPreview}.button`)}
        </Button>
      );
    }

    return (
      <div {...classes(typeOfPreview !== 'preview' ? 'two-articles' : '')}>
        <Lightbox onClose={this.onClosePreview}>
          <PreviewLightboxContent
            firstArticle={firstArticle}
            secondArticle={secondArticle}
            label={label}
            contentType={contentType}
            typeOfPreview={typeOfPreview}
            onChangePreviewLanguage={this.onChangePreviewLanguage}
            previewLanguage={previewLanguage}
          />
        </Lightbox>
      </div>
    );
  }
}

export default injectT(PreviewDraftLightbox);

PreviewDraftLightbox.propTypes = {
  getArticle: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  contentType: PropTypes.string,
  typeOfPreview: PropTypes.oneOf([
    'preview',
    'previewProductionArticle',
    'previewLanguageArticle',
  ]),
};
