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
import { getPreviewArticle } from '../../modules/article/articleApi';
import Lightbox from '../Lightbox';
import PreviewDraft from './PreviewDraft';

const classes = new BEMHelper({
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
    this.state = { previewArticle: undefined };
    this.openPreview = this.openPreview.bind(this);
    this.onClosePreview = this.onClosePreview.bind(this);
  }

  onClosePreview() {
    this.setState({ showPreview: false });
  }

  async openPreview() {
    const { getArticle } = this.props;
    const originalArticle = transformArticle(getArticle());
    const previewArticle = await getPreviewArticle(
      originalArticle,
      originalArticle.language,
    );
    this.setState({ previewArticle, showPreview: true });
  }

  render() {
    const { previewArticle, showPreview } = this.state;
    const { label, contentType, t } = this.props;
    if (!showPreview) {
      return (
        <Button {...classes('button')} onClick={this.openPreview}>
          {t('form.preview')}
        </Button>
      );
    }
    return (
      <div {...classes()}>
        <Lightbox onClose={this.onClosePreview}>
          <PreviewDraft
            article={previewArticle}
            label={label}
            contentType={contentType}
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
};
