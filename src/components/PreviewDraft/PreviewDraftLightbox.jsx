/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Button } from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import * as articleApi from '../../modules/article/articleApi';
import Lightbox from '../Lightbox';
import PreviewDraft from './PreviewDraft';

export const classes = new BEMHelper({
  name: 'preview-draft',
  prefix: 'c-',
});

const transformArticle = article => ({
  ...article,
  title: { title: article.title, language: article.language },
  introduction: { introduction: article.introduction },
  tags: { tags: article.tags, language: article.language },
  content: {
    content: article.content,
    language: article.language,
  },
  metaDescription: {
    metaDescription: article.metaDescription,
  },
});

class PreviewDraftLightbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previewDraftArticle: undefined,
      articleInProduction: undefined,
      showPreview: false,
    };
    this.openPreview = this.openPreview.bind(this);
    this.onClosePreview = this.onClosePreview.bind(this);
  }

  onClosePreview() {
    this.setState({ showPreview: false });
  }

  async openPreview() {
    const { getArticle, compareWithArticle } = this.props;
    const draft = getArticle();
    const originalArticle = transformArticle(draft);
    const previewDraftArticle = await articleApi.getPreviewArticle(
      originalArticle,
      originalArticle.language,
    );
    const articleInProduction = compareWithArticle
      ? await articleApi.getArticleFromArticleConverter(
          originalArticle.id,
          originalArticle.language,
        )
      : undefined;
    this.setState({
      previewDraftArticle,
      articleInProduction,
      showPreview: true,
    });
  }

  render() {
    const {
      previewDraftArticle,
      showPreview,
      articleInProduction,
    } = this.state;
    const { label, contentType, compareWithArticle, t } = this.props;
    if (!showPreview) {
      return (
        <Button {...classes('button')} onClick={this.openPreview}>
          {compareWithArticle
            ? t('form.previewAndCompare.button')
            : t('form.preview')}
        </Button>
      );
    }
    return (
      <div {...classes(compareWithArticle ? 'two-articles' : '')}>
        <Lightbox onClose={this.onClosePreview}>
          <div {...classes('article')}>
            {compareWithArticle && (
              <h2 className="u-4/6@desktop u-push-1/6@desktop">
                {t('form.previewAndCompare.draft')}
              </h2>
            )}
            <PreviewDraft
              article={previewDraftArticle}
              label={label}
              contentType={contentType}
            />
          </div>
          {compareWithArticle &&
            articleInProduction && (
              <div {...classes('article')}>
                <h2 className="u-4/6@desktop u-push-1/6@desktop">
                  {t('form.previewAndCompare.article')}
                </h2>
                <PreviewDraft
                  article={articleInProduction}
                  label={label}
                  contentType={contentType}
                />
              </div>
            )}
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
  compareWithArticle: PropTypes.bool,
};

PreviewDraftLightbox.defaultProps = {
  compareWithArticle: false,
};
